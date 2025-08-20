using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Mock.Migrations
{
    public partial class AddUserActionsToExchange : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "User1Action",
                table: "Exchanges",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "User2Action",
                table: "Exchanges",
                type: "int",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "User1Action",
                table: "Exchanges");

            migrationBuilder.DropColumn(
                name: "User2Action",
                table: "Exchanges");
        }
    }
}
