using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Projectwerk.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class Initial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            /*
            migrationBuilder.CreateTable(
                name: "Game",
                columns: table => new
                {
                    GameID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Category = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    ReleaseYear = table.Column<int>(type: "int", nullable: true),
                    Publisher = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    ConsoleType = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    CoverImage = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    RentalPricePerDay = table.Column<decimal>(type: "decimal(10,2)", nullable: true),
                    IsAvailable = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false, defaultValue: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Game__2AB897DD9C42FE40", x => x.GameID);
                });

            migrationBuilder.CreateTable(
                name: "User",
                columns: table => new
                {
                    UserID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FirstName = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    LastName = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Password = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    PhoneNumber = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    Role = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true, defaultValue: "client"),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false, defaultValue: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__User__1788CCACF3B8A4A9", x => x.UserID);
                });

            migrationBuilder.CreateTable(
                name: "Rental",
                columns: table => new
                {
                    RentalID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserID = table.Column<int>(type: "int", nullable: true),
                    GameID = table.Column<int>(type: "int", nullable: true),
                    StartRentalPeriod = table.Column<DateTime>(type: "datetime2", nullable: false),
                    EndRentalPeriod = table.Column<DateTime>(type: "datetime2", nullable: false),
                    NumberOfExtensions = table.Column<int>(type: "int", nullable: true, defaultValue: 0),
                    RentalPrice = table.Column<decimal>(type: "decimal(10,2)", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Rental__9700596305A5A441", x => x.RentalID);
                    table.ForeignKey(
                        name: "FK__Rental__GameID__6442E2C9",
                        column: x => x.GameID,
                        principalTable: "Game",
                        principalColumn: "GameID");
                    table.ForeignKey(
                        name: "FK__Rental__UserID__634EBE90",
                        column: x => x.UserID,
                        principalTable: "User",
                        principalColumn: "UserID");
                });

            migrationBuilder.CreateTable(
                name: "Reservation",
                columns: table => new
                {
                    ReservationID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserID = table.Column<int>(type: "int", nullable: true),
                    GameID = table.Column<int>(type: "int", nullable: true),
                    PickupDate = table.Column<DateOnly>(type: "date", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Reservat__B7EE5F04AD3AF1A4", x => x.ReservationID);
                    table.ForeignKey(
                        name: "FK__Reservati__GameI__5F7E2DAC",
                        column: x => x.GameID,
                        principalTable: "Game",
                        principalColumn: "GameID");
                    table.ForeignKey(
                        name: "FK__Reservati__UserI__5E8A0973",
                        column: x => x.UserID,
                        principalTable: "User",
                        principalColumn: "UserID");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Rental_GameID",
                table: "Rental",
                column: "GameID");

            migrationBuilder.CreateIndex(
                name: "IX_Rental_UserID",
                table: "Rental",
                column: "UserID");

            migrationBuilder.CreateIndex(
                name: "IX_Reservation_GameID",
                table: "Reservation",
                column: "GameID");

            migrationBuilder.CreateIndex(
                name: "IX_Reservation_UserID",
                table: "Reservation",
                column: "UserID");
                */
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Rental");

            migrationBuilder.DropTable(
                name: "Reservation");

            migrationBuilder.DropTable(
                name: "Game");

            migrationBuilder.DropTable(
                name: "User");
        }
    }
}
