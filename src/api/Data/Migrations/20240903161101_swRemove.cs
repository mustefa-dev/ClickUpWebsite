using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace TicketSystem.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class swRemove : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PushSubscription");

            migrationBuilder.RenameColumn(
                name: "Lng",
                table: "Comments",
                newName: "Lan");

            migrationBuilder.AlterColumn<string>(
                name: "AssignedUserId",
                table: "Tickets",
                type: "character varying(26)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(26)");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Lan",
                table: "Comments",
                newName: "Lng");

            migrationBuilder.AlterColumn<string>(
                name: "AssignedUserId",
                table: "Tickets",
                type: "character varying(26)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "character varying(26)",
                oldNullable: true);

            migrationBuilder.CreateTable(
                name: "PushSubscription",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Auth = table.Column<string>(type: "text", nullable: false),
                    Endpoint = table.Column<string>(type: "text", nullable: false),
                    P256dh = table.Column<string>(type: "text", nullable: false),
                    UserId = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PushSubscription", x => x.Id);
                });
        }
    }
}
