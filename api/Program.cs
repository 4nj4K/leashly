
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDb>(options => options.UseSqlite("Data Source=leashly.db"));
builder.Services.AddCors(options => options.AddDefaultPolicy(policy => policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod()));
builder.WebHost.UseUrls("http://0.0.0.0:5080");

var app = builder.Build();
app.UseCors();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDb>();
    db.Database.EnsureCreated();
}

string[] allowedColors = ["orchid", "pink", "coral", "gold", "lime", "mint", "sky", "blue"];

string NewInviteCode()
{
    const string letters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    return new string(Enumerable.Range(0, 6).Select(_ => letters[Random.Shared.Next(letters.Length)]).ToArray());
}

app.MapPost("/api/families", async (CreateFamilyRequest request, AppDb db) =>
{
    if (string.IsNullOrWhiteSpace(request.Name)) return Results.BadRequest("Skriv ditt namn.");
    if (!allowedColors.Contains(request.Color)) return Results.BadRequest("Ogiltig färg.");

    var code = NewInviteCode();
    while (await db.Families.AnyAsync(f => f.InviteCode == code)) code = NewInviteCode();

    var family = new Family
    {
        Name = string.IsNullOrWhiteSpace(request.FamilyName) ? "Vår flock" : request.FamilyName.Trim(),
        InviteCode = code
    };
    db.Families.Add(family);
    await db.SaveChangesAsync();

    var member = new Member { FamilyId = family.Id, Name = request.Name.Trim(), Color = request.Color };
    db.Members.Add(member);
    await db.SaveChangesAsync();

    return Results.Ok(new { family, member });
});

app.MapGet("/api/invites/{code}", async (string code, AppDb db) =>
{
    var family = await db.Families.FirstOrDefaultAsync(f => f.InviteCode == code.ToUpper());
    if (family is null) return Results.NotFound("Inbjudan hittades inte.");

    var members = await db.Members.Where(m => m.FamilyId == family.Id).ToListAsync();
    return Results.Ok(new { family, members });
});

app.MapPost("/api/invites/{code}/members", async (string code, NewMemberRequest request, AppDb db) =>
{
    var family = await db.Families.FirstOrDefaultAsync(f => f.InviteCode == code.ToUpper());
    if (family is null) return Results.NotFound("Inbjudan hittades inte.");
    if (string.IsNullOrWhiteSpace(request.Name)) return Results.BadRequest("Skriv ditt namn.");
    if (!allowedColors.Contains(request.Color)) return Results.BadRequest("Ogiltig färg.");

    var colorTaken = await db.Members.AnyAsync(m => m.FamilyId == family.Id && m.Color == request.Color);
    if (colorTaken) return Results.Conflict("Färgen är redan tagen.");

    var member = new Member { FamilyId = family.Id, Name = request.Name.Trim(), Color = request.Color };
    db.Members.Add(member);
    await db.SaveChangesAsync();

    return Results.Ok(new { family, member });
});

app.MapGet("/api/families/{familyId}/members", async (int familyId, AppDb db) =>
    await db.Members.Where(m => m.FamilyId == familyId).ToListAsync());

app.MapGet("/api/families/{familyId}/walks", async (int familyId, AppDb db) =>
    await db.Walks.Where(w => w.FamilyId == familyId).OrderBy(w => w.Date).ThenBy(w => w.Time).ToListAsync());

app.MapPost("/api/families/{familyId}/walks", async (int familyId, Walk walk, AppDb db) =>
{
    var memberInFamily = await db.Members.AnyAsync(m => m.Id == walk.MemberId && m.FamilyId == familyId);
    if (!memberInFamily) return Results.BadRequest("Personen finns inte i flocken.");

    walk.Id = 0;
    walk.FamilyId = familyId;
    db.Walks.Add(walk);
    await db.SaveChangesAsync();
    return Results.Created($"/api/families/{familyId}/walks/{walk.Id}", walk);
});

app.MapDelete("/api/families/{familyId}/walks/{id}", async (int familyId, int id, AppDb db) =>
{
    var walk = await db.Walks.FirstOrDefaultAsync(w => w.Id == id && w.FamilyId == familyId);
    if (walk is null) return Results.NotFound();

    db.Walks.Remove(walk);
    await db.SaveChangesAsync();
    return Results.NoContent();
});

app.Run();