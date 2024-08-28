using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TicketSystem.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class FeatureColor : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "FeatuerColor",
                table: "Features",
                newName: "FeatureColor");

            migrationBuilder.AddColumn<string>(
                name: "SubscriptionInfo_Note",
                table: "Companies",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "SubscriptionInfo_PaymentMethod",
                table: "Companies",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<decimal>(
                name: "SubscriptionInfo_Price",
                table: "Companies",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SubscriptionInfo_Note",
                table: "Companies");

            migrationBuilder.DropColumn(
                name: "SubscriptionInfo_PaymentMethod",
                table: "Companies");

            migrationBuilder.DropColumn(
                name: "SubscriptionInfo_Price",
                table: "Companies");

            migrationBuilder.RenameColumn(
                name: "FeatureColor",
                table: "Features",
                newName: "FeatuerColor");
        }
    }
}
