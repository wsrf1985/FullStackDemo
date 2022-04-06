namespace ITSMCodingTest.Models
{
    /// <summary>
    /// The View which describes the country data we want to send back to the front end.
    /// </summary>
    public class CountryView
    {
        /// <summary>
        /// Name of the Country
        /// </summary>
        public string Name { get; set; }
        /// <summary>
        /// Link to an SVG of the country's flag
        /// </summary>
        public string Flag { get; set; }
    }
}