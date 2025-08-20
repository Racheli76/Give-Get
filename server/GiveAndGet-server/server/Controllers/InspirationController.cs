using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using System.Net.Http;
using System.Threading.Tasks;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InspirationController : ControllerBase
    {
        private readonly HttpClient _httpClient;

        public InspirationController()
        {
            _httpClient = new HttpClient();
        }

        [HttpGet]
        public async Task<IActionResult> GetInspiration()
        {
            try
            {
                // שלב 1: קבלת משפט השראה מה-API
                var response = await _httpClient.GetStringAsync("https://zenquotes.io/api/random");
                var quoteJson = JsonDocument.Parse(response);

                // שלב 2: בדיקת תקינות התגובה ושליפת המשפט
                if (quoteJson.RootElement.ValueKind == JsonValueKind.Array && quoteJson.RootElement.GetArrayLength() > 0)
                {
                    var quoteElement = quoteJson.RootElement[0];
                    if (quoteElement.TryGetProperty("q", out var quoteProp))
                    {
                        var quoteText = quoteProp.GetString();

                        // שלב 3: תרגום לעברית (סימולציה / או קריאה ל-Google Translate API אם תרצה)
                        string translatedQuote = await TranslateToHebrew(quoteText);

                        // שלב 4: החזרת המשפט המתורגם
                        return Ok(translatedQuote);
                    }
                }

                return BadRequest("לא נמצא משפט השראה");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"אירעה שגיאה: {ex.Message}");
            }
        }

        private async Task<string> TranslateToHebrew(string text)
        {
            try
            {
                // בניית URL לבקשת תרגום מאנגלית לעברית
                string apiUrl = $"https://api.mymemory.translated.net/get?q={Uri.EscapeDataString(text)}&langpair=en|he";

                using var client = new HttpClient();
                var response = await client.GetStringAsync(apiUrl);

                // ניתוח ה-JSON שהתקבל
                var json = JsonDocument.Parse(response);
                var translatedText = json.RootElement
                                        .GetProperty("responseData")
                                        .GetProperty("translatedText")
                                        .GetString();

                return translatedText ?? "שגיאה בתרגום";
            }
            catch (Exception ex)
            {
                // במקרה של שגיאה - מחזיר את הטקסט המקורי עם הודעה
                return $"[שגיאה בתרגום] {text}";
            }
        }

    }
}
