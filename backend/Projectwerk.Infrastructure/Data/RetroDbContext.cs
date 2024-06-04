using Microsoft.EntityFrameworkCore;
using Projectwerk.Infrastructure.Models;

namespace Projectwerk.Infrastructure.Data;

public partial class RetroDbContext : DbContext
{
    public RetroDbContext()
    {
    }

    public RetroDbContext(DbContextOptions<RetroDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Game> Games { get; set; }
    public virtual DbSet<Rental> Rentals { get; set; }
    public virtual DbSet<Reservation> Reservations { get; set; }
    public virtual DbSet<User> Users { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https: //go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        optionsBuilder.UseSqlServer(
            "Server=vichogent.be,40056;Database=RetroRentalDB;User ID=retrorental;Password=Retro_Rental_001;Encrypt=True;TrustServerCertificate=True;");
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Game>(entity =>
        {
            entity.HasKey(e => e.GameId).HasName("PK__Game__2AB897DD9C42FE40");

            entity.Property(e => e.IsAvailable).HasDefaultValue(true);
            entity.Property(e => e.IsDeleted).HasDefaultValue(false);
        });

        modelBuilder.Entity<Rental>(entity =>
        {
            entity.HasKey(e => e.RentalId).HasName("PK__Rental__9700596305A5A441");

            entity.Property(e => e.NumberOfExtensions).HasDefaultValue(0);

            entity.HasOne(d => d.Game).WithMany(p => p.Rentals).HasForeignKey(d => d.GameId)
                .HasConstraintName("FK__Rental__GameID__6442E2C9");

            entity.HasOne(d => d.User).WithMany(p => p.Rentals).HasForeignKey(d => d.UserId)
                .HasConstraintName("FK__Rental__UserID__634EBE90");
        });

        modelBuilder.Entity<Reservation>(entity =>
        {
            entity.HasKey(e => e.ReservationId).HasName("PK__Reservat__B7EE5F04AD3AF1A4");

            entity.HasOne(d => d.Game).WithMany(p => p.Reservations).HasForeignKey(d => d.GameId)
                .HasConstraintName("FK__Reservati__GameI__5F7E2DAC");

            entity.HasOne(d => d.User).WithMany(p => p.Reservations).HasForeignKey(d => d.UserId)
                .HasConstraintName("FK__Reservati__UserI__5E8A0973");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.UserId).HasName("PK__User__1788CCACF3B8A4A9");

            entity.Property(e => e.IsDeleted).HasDefaultValue(false);
            entity.Property(e => e.Role).HasDefaultValue("client");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}