using System;
using System.Text;
using System.Web.Mvc;

namespace ITSMCodingTest.Helpers
{
    public class BaseController : Controller
    {
        /// <summary>
        /// When a JsonResult is sent back to the front end, the result will serialize using the Newtonsoft JSON library rather than
        /// the JSON.NET library built in.
        /// </summary>
        /// <param name="data"></param>
        /// <param name="contentType"></param>
        /// <param name="contentEncoding"></param>
        /// <param name="behavior"></param>
        /// <returns></returns>
        protected override JsonResult Json(object data, string contentType, Encoding contentEncoding, JsonRequestBehavior behavior)
        {
            return new JsonNetResult
            {
                Data = data,
                ContentType = contentType,
                ContentEncoding = contentEncoding,
                JsonRequestBehavior = behavior
            };
        }

        /// <summary>
        /// Returns a Successful Json Operation Result
        /// </summary>
        /// <param name="recordId"></param>
        /// <returns></returns>
        protected JsonResult SuccessResult()
        {
            var result = new OperationResult
            {
                Result = true
            };
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// Returns a Successful Json Operation Result with an associated Record ID
        /// </summary>
        /// <param name="recordId"></param>
        /// <returns></returns>
        protected JsonResult SuccessResult(int recordId)
        {
            var result = new OperationResult
            {
                RecordId = recordId,
                Result = true
            };
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// Returns a Successful Json Operation Result with an association Result Set
        /// </summary>
        /// <param name="resultSet"></param>
        /// <returns></returns>
        protected JsonResult SuccessResult(object resultSet)
        {
            var result = new OperationResult
            {
                ResultSet = resultSet,
                Result = true
            };
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// Returns a Failed Json Operation Result with an associated Error Message
        /// </summary>
        /// <param name="error"></param>
        /// <returns></returns>
        protected JsonResult FailedResult(string error)
        {
            var result = new OperationResult
            {
                Result = false,
                Error = error
            };
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// Returns a Failed Json Operation Result with the message from an Exception
        /// </summary>
        /// <param name="exception"></param>
        /// <returns></returns>
        protected JsonResult FailedResult(Exception exception)
        {
            var result = new OperationResult
            {
                Result = false,
                Error = exception.Message
            };
            return Json(result, JsonRequestBehavior.AllowGet);
        }
    }
}