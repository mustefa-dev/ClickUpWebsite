using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TicketSystem.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class Lng : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Lan",
                table: "Comments",
                newName: "Lng");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Lng",
                table: "Comments",
                newName: "Lan");
        }
    }
}
