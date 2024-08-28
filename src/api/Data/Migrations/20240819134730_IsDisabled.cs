﻿using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TicketSystem.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class IsDisabled : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsDisabled",
                table: "Companies",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsDisabled",
                table: "Companies");
        }
    }
}
