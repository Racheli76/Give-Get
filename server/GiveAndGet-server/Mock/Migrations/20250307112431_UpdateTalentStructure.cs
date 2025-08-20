using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Mock.Migrations
{
    public partial class UpdateTalentStructure : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TalentUsers_Talents_TalentId",
                table: "TalentUsers");

            migrationBuilder.DropForeignKey(
                name: "FK_TalentUsers_Users_UserId",
                table: "TalentUsers");

            migrationBuilder.DropPrimaryKey(
                name: "PK_TalentUsers",
                table: "TalentUsers");

            migrationBuilder.RenameTable(
                name: "TalentUsers",
                newName: "TalentUser");

            migrationBuilder.RenameIndex(
                name: "IX_TalentUsers_TalentId",
                table: "TalentUser",
                newName: "IX_TalentUser_TalentId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_TalentUser",
                table: "TalentUser",
                columns: new[] { "UserId", "TalentId" });

            migrationBuilder.AddForeignKey(
                name: "FK_TalentUser_Talents_TalentId",
                table: "TalentUser",
                column: "TalentId",
                principalTable: "Talents",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_TalentUser_Users_UserId",
                table: "TalentUser",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TalentUser_Talents_TalentId",
                table: "TalentUser");

            migrationBuilder.DropForeignKey(
                name: "FK_TalentUser_Users_UserId",
                table: "TalentUser");

            migrationBuilder.DropPrimaryKey(
                name: "PK_TalentUser",
                table: "TalentUser");

            migrationBuilder.RenameTable(
                name: "TalentUser",
                newName: "TalentUsers");

            migrationBuilder.RenameIndex(
                name: "IX_TalentUser_TalentId",
                table: "TalentUsers",
                newName: "IX_TalentUsers_TalentId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_TalentUsers",
                table: "TalentUsers",
                columns: new[] { "UserId", "TalentId" });

            migrationBuilder.AddForeignKey(
                name: "FK_TalentUsers_Talents_TalentId",
                table: "TalentUsers",
                column: "TalentId",
                principalTable: "Talents",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_TalentUsers_Users_UserId",
                table: "TalentUsers",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
