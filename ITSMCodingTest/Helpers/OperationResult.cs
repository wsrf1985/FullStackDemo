namespace ITSMCodingTest.Helpers
{
    public class OperationResult
    {
        /// <summary>
        /// The result of the operation, True if is was successful, False if it failed.
        /// </summary>
        public bool Result { get; set; }
        /// <summary>
        /// An optional record ID to include as part of the result.
        /// </summary>
        public int RecordId { get; set; }
        /// <summary>
        /// If the Result was False, provide a helpful error message.
        /// </summary>
        public string Error { get; set; }
        /// <summary>
        /// An object which contains any data returned back from the controller.
        /// </summary>
        public object ResultSet { get; set; }
    }
}