using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Database.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "public");

            migrationBuilder.CreateTable(
                name: "event_halls",
                schema: "public",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    name = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    description = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: false),
                    max_capacity = table.Column<int>(type: "integer", nullable: false),
                    base_price = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: false),
                    location = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    created_on_utc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_on_utc = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    is_deleted = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_event_halls", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "users",
                schema: "public",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    clerk_id = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    first_name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    last_name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    email = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    phone_number = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    role = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    created_on_utc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_on_utc = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    is_deleted = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_users", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "available_schedules",
                schema: "public",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    day_of_week = table.Column<int>(type: "integer", nullable: false),
                    start_time = table.Column<TimeOnly>(type: "time without time zone", nullable: false),
                    end_time = table.Column<TimeOnly>(type: "time without time zone", nullable: false),
                    event_hall_id = table.Column<Guid>(type: "uuid", nullable: false),
                    created_on_utc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_on_utc = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    is_deleted = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_available_schedules", x => x.id);
                    table.ForeignKey(
                        name: "fk_available_schedules_event_halls_event_hall_id",
                        column: x => x.event_hall_id,
                        principalSchema: "public",
                        principalTable: "event_halls",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "event_hall_images",
                schema: "public",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    image_url = table.Column<string>(type: "character varying(2048)", maxLength: 2048, nullable: false),
                    image_public_id = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    description = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    event_hall_id = table.Column<Guid>(type: "uuid", nullable: false),
                    created_on_utc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_on_utc = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    is_deleted = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_event_hall_images", x => x.id);
                    table.ForeignKey(
                        name: "fk_event_hall_images_event_halls_event_hall_id",
                        column: x => x.event_hall_id,
                        principalSchema: "public",
                        principalTable: "event_halls",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "services",
                schema: "public",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    name = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    description = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    additional_cost = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: false),
                    event_hall_id = table.Column<Guid>(type: "uuid", nullable: false),
                    created_on_utc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_on_utc = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    is_deleted = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_services", x => x.id);
                    table.ForeignKey(
                        name: "fk_services_event_halls_event_hall_id",
                        column: x => x.event_hall_id,
                        principalSchema: "public",
                        principalTable: "event_halls",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "reservations",
                schema: "public",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    reservation_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    start_time = table.Column<TimeOnly>(type: "time without time zone", nullable: false),
                    end_time = table.Column<TimeOnly>(type: "time without time zone", nullable: false),
                    total_cost = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: false),
                    status = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    notes = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    client_id = table.Column<Guid>(type: "uuid", nullable: false),
                    event_hall_id = table.Column<Guid>(type: "uuid", nullable: false),
                    created_on_utc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_on_utc = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    is_deleted = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_reservations", x => x.id);
                    table.ForeignKey(
                        name: "fk_reservations_event_halls_event_hall_id",
                        column: x => x.event_hall_id,
                        principalSchema: "public",
                        principalTable: "event_halls",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_reservations_users_client_id",
                        column: x => x.client_id,
                        principalSchema: "public",
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "reservation_services",
                schema: "public",
                columns: table => new
                {
                    reservation_id = table.Column<Guid>(type: "uuid", nullable: false),
                    service_id = table.Column<Guid>(type: "uuid", nullable: false),
                    price_at_reservation = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: false),
                    created_on_utc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_on_utc = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    is_deleted = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_reservation_services", x => new { x.reservation_id, x.service_id });
                    table.ForeignKey(
                        name: "fk_reservation_services_reservations_reservation_id",
                        column: x => x.reservation_id,
                        principalSchema: "public",
                        principalTable: "reservations",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_reservation_services_services_service_id",
                        column: x => x.service_id,
                        principalSchema: "public",
                        principalTable: "services",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "reservation_tasks",
                schema: "public",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    description = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    is_completed = table.Column<bool>(type: "boolean", nullable: false),
                    reservation_id = table.Column<Guid>(type: "uuid", nullable: false),
                    created_on_utc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_on_utc = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    is_deleted = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_reservation_tasks", x => x.id);
                    table.ForeignKey(
                        name: "fk_reservation_tasks_reservations_reservation_id",
                        column: x => x.reservation_id,
                        principalSchema: "public",
                        principalTable: "reservations",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "ix_available_schedules_created_on_utc",
                schema: "public",
                table: "available_schedules",
                column: "created_on_utc");

            migrationBuilder.CreateIndex(
                name: "ix_available_schedules_day_of_week",
                schema: "public",
                table: "available_schedules",
                column: "day_of_week");

            migrationBuilder.CreateIndex(
                name: "ix_available_schedules_event_hall_id",
                schema: "public",
                table: "available_schedules",
                column: "event_hall_id");

            migrationBuilder.CreateIndex(
                name: "ix_available_schedules_event_hall_id_day_of_week",
                schema: "public",
                table: "available_schedules",
                columns: new[] { "event_hall_id", "day_of_week" });

            migrationBuilder.CreateIndex(
                name: "ix_event_hall_images_created_on_utc",
                schema: "public",
                table: "event_hall_images",
                column: "created_on_utc");

            migrationBuilder.CreateIndex(
                name: "ix_event_hall_images_event_hall_id",
                schema: "public",
                table: "event_hall_images",
                column: "event_hall_id");

            migrationBuilder.CreateIndex(
                name: "ix_event_hall_images_image_public_id",
                schema: "public",
                table: "event_hall_images",
                column: "image_public_id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_event_halls_base_price",
                schema: "public",
                table: "event_halls",
                column: "base_price");

            migrationBuilder.CreateIndex(
                name: "ix_event_halls_created_on_utc",
                schema: "public",
                table: "event_halls",
                column: "created_on_utc");

            migrationBuilder.CreateIndex(
                name: "ix_event_halls_max_capacity",
                schema: "public",
                table: "event_halls",
                column: "max_capacity");

            migrationBuilder.CreateIndex(
                name: "ix_event_halls_name",
                schema: "public",
                table: "event_halls",
                column: "name");

            migrationBuilder.CreateIndex(
                name: "ix_reservation_services_created_on_utc",
                schema: "public",
                table: "reservation_services",
                column: "created_on_utc");

            migrationBuilder.CreateIndex(
                name: "ix_reservation_services_service_id",
                schema: "public",
                table: "reservation_services",
                column: "service_id");

            migrationBuilder.CreateIndex(
                name: "ix_reservation_tasks_created_on_utc",
                schema: "public",
                table: "reservation_tasks",
                column: "created_on_utc");

            migrationBuilder.CreateIndex(
                name: "ix_reservation_tasks_is_completed",
                schema: "public",
                table: "reservation_tasks",
                column: "is_completed");

            migrationBuilder.CreateIndex(
                name: "ix_reservation_tasks_reservation_id",
                schema: "public",
                table: "reservation_tasks",
                column: "reservation_id");

            migrationBuilder.CreateIndex(
                name: "ix_reservations_client_id",
                schema: "public",
                table: "reservations",
                column: "client_id");

            migrationBuilder.CreateIndex(
                name: "ix_reservations_created_on_utc",
                schema: "public",
                table: "reservations",
                column: "created_on_utc");

            migrationBuilder.CreateIndex(
                name: "ix_reservations_event_hall_id",
                schema: "public",
                table: "reservations",
                column: "event_hall_id");

            migrationBuilder.CreateIndex(
                name: "ix_reservations_event_hall_id_reservation_date",
                schema: "public",
                table: "reservations",
                columns: new[] { "event_hall_id", "reservation_date" });

            migrationBuilder.CreateIndex(
                name: "ix_reservations_reservation_date",
                schema: "public",
                table: "reservations",
                column: "reservation_date");

            migrationBuilder.CreateIndex(
                name: "ix_reservations_status",
                schema: "public",
                table: "reservations",
                column: "status");

            migrationBuilder.CreateIndex(
                name: "ix_services_created_on_utc",
                schema: "public",
                table: "services",
                column: "created_on_utc");

            migrationBuilder.CreateIndex(
                name: "ix_services_event_hall_id",
                schema: "public",
                table: "services",
                column: "event_hall_id");

            migrationBuilder.CreateIndex(
                name: "ix_services_name",
                schema: "public",
                table: "services",
                column: "name");

            migrationBuilder.CreateIndex(
                name: "ix_users_clerk_id",
                schema: "public",
                table: "users",
                column: "clerk_id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_users_created_on_utc",
                schema: "public",
                table: "users",
                column: "created_on_utc");

            migrationBuilder.CreateIndex(
                name: "ix_users_email",
                schema: "public",
                table: "users",
                column: "email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_users_role",
                schema: "public",
                table: "users",
                column: "role");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "available_schedules",
                schema: "public");

            migrationBuilder.DropTable(
                name: "event_hall_images",
                schema: "public");

            migrationBuilder.DropTable(
                name: "reservation_services",
                schema: "public");

            migrationBuilder.DropTable(
                name: "reservation_tasks",
                schema: "public");

            migrationBuilder.DropTable(
                name: "services",
                schema: "public");

            migrationBuilder.DropTable(
                name: "reservations",
                schema: "public");

            migrationBuilder.DropTable(
                name: "event_halls",
                schema: "public");

            migrationBuilder.DropTable(
                name: "users",
                schema: "public");
        }
    }
}
