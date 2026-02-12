
/** |Time Zone Central| 
 * ===> 1. Why Time Zones Exist: (The Big Picture):
 * The Earth rotates once every ~ 24 hours.
 * That rotation means different parts of the world experience noon at different times. 
 * 
 * To solve this:
 * - The world is divided into time zones 
 * - Each zone is roughly 15 degrees of longitude (360 degrees / 24)
 * 
 * Without time zones: 
 * - Noon in New York and Tokyo would be the same clock time, which would be chaos.
 * 
 * ===> 2. UTC vs GMT (The Absolute Reference):
 * GMT (Greenwich Mean Time):
 * - Historical standard
 * - Based on solar time at Greenwich, England. 
 * - Not used much in modern computing. 
 * 
 * UTC (Coordinated Universal Time):
 * - Modern global time standard
 * - Based on atmoic clocks
 * - Does not observe daylight saving
 * - All time zones are defined as offsets from UTC
 * UTC is the "zero point" of time zones. 
 * 
 * ===> 3. Time Zone Offsets (How They Work):
 * Each time zone is defined as:
 * Local Time = UTC +- Offset
 * 
 * Examples: 
 * Location: London (winter) => Time Zone: UTC => Offset: +0
 * Location: New York (EST) => Time Zone: UTC-5
 * Location: Portland (PST) => Time Zone: UTC-8
 * Location: Tokyo (JST) => Time Zone: UTC+9 
 * Location: South Africa => Time Zone: UTC+2
 * 
 * ===> 4. Daylight Saving Time (DST) - The Pain Point:
 * Some regions:
 * - Shift clocks forward 1 hour in summer
 * - Shift back in winter
 * 
 * Examples:
 * PST (UTC-8) -> PDT (UTC-7)
 * EST (UTC-5) -> EDT (UTC-4)
 * DST rules vary by country and change over time 
 * Note: This is why you should never manually calculate offsets in real applications.
 * 
 * ===> 5. American Time Zones (All of Them):
 * Mainland US:
 * Zone: Eastern => Abbreviation: EST/EDT => Standard Offset: UTC-5/-4
 * Zone: Central => Abbreviation: CST/CDT => Standard Offset: UTC-6/-5
 * Zone: Mountain => Abbreviation: MST/MDT => Standard Offset: UTC-7/-6
 * Zone: Pacific => Abbreviation: PST/PDT => Standard Offset: UTC-8/-7
 * 
 * Other US Zones:
 * Zone: Alaska => Offset: UTC-9
 * Zone: Hawaii => Offset: UTC-10 (no DST)
 * Zone: Puerto Rico => Offset: UTC-4 (no DST)
 * 
 * ===> 6. The Correct Way: IANA Time Zone Identifiers:
 * Modermn systems use IANA Time Zone IDs, not Abbreviations:
 * Why? PST is ambiguous, rules change, and countries share abbreviations.
 * 
 * Format:
 * Area/Location
 * 
 * Examples:
 * - America/Los_Angeles
 * - America/New_York
 * - Europe/London
 * - Africa/Johannesburg
 * - Asia/Tokyo
 * 
 * ===> 7. Portland, OR - Your Local Time Zone:
 * Portland uses:
 * America/Los_Angeles
 * 
 * This automatically handles:
 * - PST vs PDT
 * - Historical DST changes
 * - Future rule changes
 * 
 * ===> 8. How JavaScript Handles Time Zones: 
 * The key object: 'Date'
 * 
 * JavaScript Date:
 * - Stores time internally in UTC 
 * - Displays in local time by default
 * 
 * -> Get Your Local Time Zone:
 * Intl.DateTimeFormat().resolveOptions().timeZone; 
 * 
 * -> Output (in Portland):
 * America/Los_Angeles
 * 
 */


/** |Date.Prototype.toLocaleString()|
 * The 'toLocaleString()' method of 'Date' instances returns a string with a language-sensitive representation of this date
 * in the local timezone. In implementations with Intl.DateTimeFormat API , this method delegates to Intl.DateTimeFormat. 
 * 
 * Every time 'toLocaleString' is called, it has to perform a search in a big database of localization strings, which is potentially
 * inefficient. When the method is called many times with the same arguments, it is better to create an Intl.DateTimeFormat object and use
 * its format() method, because a DateTimeFormat object remembers the arguments passed to it and may decide to cache a slice of the
 * database, so future format calls can search for localization strings within a more constrained context. 
 * 
 * -> Example:
 * const event = new Date(Date.UTC(2012, 11, 20, 3, 0, 0, )); 
 * 
 * // British English uses day-month-year order and 24-hour time without AM/PM:
 * console.log(event.toLocaleString("en-GB", { timeZone: "UTC" }));
 * Expected output: "20/12/2012, 03:00:00"
 * 
 * // Korean uses year-month-day order and 12-hour time with AM/PM:
 * console.log(event.toLocaleString("ko-KR", {timeZone: "UTC" }));
 * // Expected output: "2012. 12. 20. 3:00:00"
 * 
 * -> Syntax:
 * toLocaleString()
 * toLocaleString(locales)
 * toLocaleString(locales, options)
 * 
 * -> Parameters: 
 * The 'locales' and 'options' parameters customize the behavior of the function and let applications specify 
 * the language whose formatting conventions should be used.
 * 
 * In implementations that support the Intl.DateTimeFormat API, these parameters correspond exactly to the 
 * 'Intl.DateTimeFormat()' constructor's parameters. Implementations without 'Intl.DateTimeFormat' support are
 * asked to ignore both parameters, making the locale used and the form of the string returned entirely 
 * implementation-dependent. 
 * 
 * locales (Optional): 
 * A string with a 'BCP 47 language tag', or an array of such strings. Corresponds to the 'locales' parameter
 * of the 'Intl.DateTimeFormat()' constructor.
 * 
 * In implementations without 'Intl.DateTimeFormat' support, this parameter is ignored and the host's locale is usually 
 * used. 
 * 
 * options (Optional):
 * A object adjusting the output format. Corresponds to the options parameter of the 'Intl.DateTimeFormat()' constructor.
 * If weekday, year, month, day, dayPeriod, hour, minute, second, and fractionalSecondDigits are all undefined, then year, month, day,
 * hour, minute, second will be set to "numeric". 
 * 
 * In implementations without 'Intl.DateTimeFormat' support, this parameter is ignored. 
 * See the 'Intl.DateTimeFormat() constructor' for details on these parameters and how to use them. 
 */

// DOM node variables:
const tournamentTimes = document.querySelectorAll('.display-ar-16-9 > a > div:nth-child(2) > div > p:nth-child(5) > span:nth-child(2)'); 
const tournamentTimeZoneTest = document.querySelector('.display-ar-16-9 > a > div:nth-child(3) > div');

tournamentTimes.forEach((time) => {
    console.log(time.textContent); // Testing 
}); 
console.log('\n'); // Testing 

// converting between time zones correctly: 
// Using toLocaleString(): 
const date = "2026-02-22"; 
const localDate = new Date(2026, 2, 22);
console.log("New Date: ", localDate); // Testing 

let time = '17:00'; // Temporary time entry
const [hours24, minutes] = time.split(":"); 
console.log("Military Hours: ", hours24); // Testing 
console.log("Military Minutes: ", minutes); // Testing  
console.log('\n'); // Testing 

localDate.setHours(parseInt(hours24, 10)); 
localDate.setMinutes(parseInt(minutes, 10)); 
console.log("Hours: ", localDate.getHours()); // Testing 
console.log("Minutes: ", localDate.getMinutes()); // Testing 
console.log('\n'); // Testing 

console.log("Local Date: ", localDate); // Testing
console.log("\n"); // Testing 

// Format it for another time zone: 
const options = {
    hour: "numeric",
    minute: "numeric",
    hour12: true, // Ensure 12-hour format with AM/PM
}
const time12h = localDate.toLocaleString("en-US", options);
console.log("Local Time: ", time12h); // Testing 
console.log("\n"); // Testing

// North American Timezones:
let northAmericanTimeZones = [
    { utc: "Central Time", zone: "America/Chicago" },
    { utc: "Eastern Time", zone: "America/New_York" },
    { utc: "Mountain Time", zone: "America/Denver" },
    { utc: "Pacific Time", zone: "America/Los_Angeles" },
    { utc: "Alaska Time", zone: "America/Anchorage" },
    { utc: "Hawaii", zone: "Pacific/Honolulu" }, 
]; 
northAmericanTimeZones.forEach((timeZone) => {
    console.log(`Time: ${localDate.toLocaleString("en-US", {timeZone: timeZone.zone})} => ${timeZone.zone} (${timeZone.utc})`); 
});