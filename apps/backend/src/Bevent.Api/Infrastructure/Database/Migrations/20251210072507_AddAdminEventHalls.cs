using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Database.Migrations
{
    /// <inheritdoc />
    public partial class AddAdminEventHalls : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "admin_id",
                schema: "public",
                table: "event_halls",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "ix_event_halls_admin_id",
                schema: "public",
                table: "event_halls",
                column: "admin_id");

            migrationBuilder.AddForeignKey(
                name: "fk_event_halls_users_admin_id",
                schema: "public",
                table: "event_halls",
                column: "admin_id",
                principalSchema: "public",
                principalTable: "users",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_event_halls_users_admin_id",
                schema: "public",
                table: "event_halls");

            migrationBuilder.DropIndex(
                name: "ix_event_halls_admin_id",
                schema: "public",
                table: "event_halls");

            migrationBuilder.DropColumn(
                name: "admin_id",
                schema: "public",
                table: "event_halls");
        }
    }
}
