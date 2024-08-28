using System.Collections.Generic;
using System.Text.Json;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace TicketSystem.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class JsonField : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Features");

            migrationBuilder.DropTable(
                name: "Socials");

            migrationBuilder.DropColumn(
                name: "ActionButton_Action",
                table: "Companies");

            migrationBuilder.DropColumn(
                name: "ActionButton_Color",
                table: "Companies");

            migrationBuilder.DropColumn(
                name: "ActionButton_Text",
                table: "Companies");

            migrationBuilder.DropColumn(
                name: "Banner_Image",
                table: "Companies");

            migrationBuilder.DropColumn(
                name: "Banner_Text",
                table: "Companies");

            migrationBuilder.DropColumn(
                name: "ButtomGrid_Grid1_Button_Action",
                table: "Companies");

            migrationBuilder.DropColumn(
                name: "ButtomGrid_Grid1_Button_Color",
                table: "Companies");

            migrationBuilder.DropColumn(
                name: "ButtomGrid_Grid1_Button_Text",
                table: "Companies");

            migrationBuilder.DropColumn(
                name: "ButtomGrid_Grid1_Title",
                table: "Companies");

            migrationBuilder.DropColumn(
                name: "ButtomGrid_Grid2_Image",
                table: "Companies");

            migrationBuilder.DropColumn(
                name: "ButtomGrid_Grid2_Title",
                table: "Companies");

            migrationBuilder.DropColumn(
                name: "Hero_Image",
                table: "Companies");

            migrationBuilder.DropColumn(
                name: "Hero_Text",
                table: "Companies");

            migrationBuilder.DropColumn(
                name: "ImageGallery",
                table: "Companies");

            migrationBuilder.DropColumn(
                name: "PersonalInfo_EmailContact",
                table: "Companies");

            migrationBuilder.DropColumn(
                name: "PersonalInfo_Location",
                table: "Companies");

            migrationBuilder.DropColumn(
                name: "PersonalInfo_PhoneContact",
                table: "Companies");

            migrationBuilder.DropColumn(
                name: "PersonalInfo_SocialMediaLinks",
                table: "Companies");

            migrationBuilder.DropColumn(
                name: "PrimaryColor",
                table: "Companies");

            migrationBuilder.DropColumn(
                name: "SecondaryColor",
                table: "Companies");

            migrationBuilder.DropColumn(
                name: "ServicesImage",
                table: "Companies");

            migrationBuilder.AddColumn<JsonDocument>(
                name: "WebsiteConfiguration",
                table: "Companies",
                type: "jsonb",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "WebsiteConfiguration",
                table: "Companies");

            migrationBuilder.AddColumn<string>(
                name: "ActionButton_Action",
                table: "Companies",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ActionButton_Color",
                table: "Companies",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ActionButton_Text",
                table: "Companies",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Banner_Image",
                table: "Companies",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Banner_Text",
                table: "Companies",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ButtomGrid_Grid1_Button_Action",
                table: "Companies",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ButtomGrid_Grid1_Button_Color",
                table: "Companies",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ButtomGrid_Grid1_Button_Text",
                table: "Companies",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ButtomGrid_Grid1_Title",
                table: "Companies",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ButtomGrid_Grid2_Image",
                table: "Companies",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ButtomGrid_Grid2_Title",
                table: "Companies",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Hero_Image",
                table: "Companies",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Hero_Text",
                table: "Companies",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<List<string>>(
                name: "ImageGallery",
                table: "Companies",
                type: "text[]",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PersonalInfo_EmailContact",
                table: "Companies",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PersonalInfo_Location",
                table: "Companies",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PersonalInfo_PhoneContact",
                table: "Companies",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<List<string>>(
                name: "PersonalInfo_SocialMediaLinks",
                table: "Companies",
                type: "text[]",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PrimaryColor",
                table: "Companies",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SecondaryColor",
                table: "Companies",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<List<string>>(
                name: "ServicesImage",
                table: "Companies",
                type: "text[]",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Features",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    CompanyId = table.Column<string>(type: "character varying(26)", maxLength: 26, nullable: false),
                    Description = table.Column<string>(type: "text", nullable: true),
                    FeatureColor = table.Column<string>(type: "text", nullable: true),
                    Icon = table.Column<string>(type: "text", nullable: true),
                    Title = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Features", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Features_Companies_CompanyId",
                        column: x => x.CompanyId,
                        principalTable: "Companies",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Socials",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    CompanyId = table.Column<string>(type: "character varying(26)", maxLength: 26, nullable: false),
                    Name = table.Column<string>(type: "text", nullable: true),
                    Type = table.Column<string>(type: "text", nullable: true),
                    Value = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Socials", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Socials_Companies_CompanyId",
                        column: x => x.CompanyId,
                        principalTable: "Companies",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Features_CompanyId",
                table: "Features",
                column: "CompanyId");

            migrationBuilder.CreateIndex(
                name: "IX_Socials_CompanyId",
                table: "Socials",
                column: "CompanyId");
        }
    }
}
