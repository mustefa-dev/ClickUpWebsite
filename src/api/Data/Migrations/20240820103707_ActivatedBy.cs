using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TicketSystem.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class ActivatedBy : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "SubDomain",
                table: "Companies",
                type: "text",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Companies",
                type: "text",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ActivatedById",
                table: "Companies",
                type: "character varying(26)",
                maxLength: 26,
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Companies_ActivatedById",
                table: "Companies",
                column: "ActivatedById");

            migrationBuilder.AddForeignKey(
                name: "FK_Companies_Users_ActivatedById",
                table: "Companies",
                column: "ActivatedById",
                principalTable: "Users",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Companies_Users_ActivatedById",
                table: "Companies");

            migrationBuilder.DropIndex(
                name: "IX_Companies_ActivatedById",
                table: "Companies");

            migrationBuilder.DropColumn(
                name: "ActivatedById",
                table: "Companies");

            migrationBuilder.AlterColumn<string>(
                name: "SubDomain",
                table: "Companies",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Companies",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text");
        }
    }
}
