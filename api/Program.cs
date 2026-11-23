
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

    if (!db.Members.Any()) 
    {
        db.Members.AddRange( 
            new Member { Id = "anja", Name = "Anja", Color = "orchid" },
            new Member { Id = "mamma", Name = "Mamma", Color = "mint" },
            new Member { Id = "pappa", Name = "Pappa", Color = "blue" },
            new Member { Id = "lillebror", Name = "Lillebror", Color = "lime" }
        );
        db.SaveChanges(); 
    }
}

app.MapGet("/api/members", async (AppDb db) => 
    await db.Members.ToListAsync());

app.MapGet("/api/walks", async (AppDb db) => 
    await db.Walks.OrderBy(w => w.Date).ThenBy(w => w.Time).ToListAsync()); 

app.MapPost("/api/walks", async (Walk walk, AppDb db) => 
{
    walk.Id = 0; 
    db.Walks.Add(walk); 
    await db.SaveChangesAsync(); 
    return Results.Created($"/api/walks/{walk.Id}", walk); 
});

app.MapDelete("/api/walks/{id}", async (int id, AppDb db) =>
{
    var walk = await db.Walks.FindAsync(id);
    if (walk is null) return Results.NotFound(); 
    db.Walks.Remove(walk); 
    await db.SaveChangesAsync(); 
    return Results.NoContent(); 
});

app.Run(); // starta backenden
