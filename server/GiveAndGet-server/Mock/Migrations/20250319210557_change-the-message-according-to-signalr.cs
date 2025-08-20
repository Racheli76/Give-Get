using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Mock.Migrations
{
    public partial class changethemessageaccordingtosignalr : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Messages_Users_ToId",
                table: "Messages");

            migrationBuilder.RenameColumn(
                name: "ToId",
                table: "Messages",
                newName: "ExchangeId");

            migrationBuilder.RenameIndex(
                name: "IX_Messages_ToId",
                table: "Messages",
                newName: "IX_Messages_ExchangeId");

            migrationBuilder.AddForeignKey(
                name: "FK_Messages_Exchanges_ExchangeId",
                table: "Messages",
                column: "ExchangeId",
                principalTable: "Exchanges",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Messages_Exchanges_ExchangeId",
                table: "Messages");

            migrationBuilder.RenameColumn(
                name: "ExchangeId",
                table: "Messages",
                newName: "ToId");

            migrationBuilder.RenameIndex(
                name: "IX_Messages_ExchangeId",
                table: "Messages",
                newName: "IX_Messages_ToId");

            migrationBuilder.AddForeignKey(
                name: "FK_Messages_Users_ToId",
                table: "Messages",
                column: "ToId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
