using Microsoft.EntityFrameworkCore;

public class AppDb(DbContextOptions<AppDb> options) : DbContext(options)
{
    public DbSet<Member> Members => Set<Member>(); 
    public DbSet<Walk> Walks => Set<Walk>(); 
}