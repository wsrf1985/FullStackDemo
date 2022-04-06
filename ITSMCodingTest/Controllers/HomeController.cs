using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.IO;
using System.Threading.Tasks;
using System.Web;
using System.Web.Hosting;
using System.Web.Mvc;
using ITSMCodingTest.Helpers;
using ITSMCodingTest.Models;
using Newtonsoft.Json;
using System.Linq;
using System.Drawing;
using System.Drawing.Imaging;
using System.Reflection;

namespace ITSMCodingTest.Controllers
{
    public class HomeController : BaseController
    {
        private AddressBookEntities dbContext = new AddressBookEntities();

        public ActionResult Index()
        {
            return View();
        }

        /// <summary>
        /// Retrieves a list of countries from the countries.json helper.
        /// Original API from https://restcountries.eu/rest/v2/all
        /// Used for the Country selector
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public JsonResult GetCountries()
        {
            try
            {
                // Read the countries.json file within the Helpers folder and map to a list of CountryView, sorted alphabetically
                // << YOUR CODE HERE >>
                List<CountryView> items = new List<CountryView>();
                string json = System.IO.File.ReadAllText(HostingEnvironment.MapPath(@"~/Helpers/countries.json"));
                items = JsonConvert.DeserializeObject<List<CountryView>>(json);
                return SuccessResult(items);
            }
            catch (Exception e)
            {
                return FailedResult(e);
            }
        }

        /// <summary>
        /// Adds a new entry into the AddressRecords table using the AddressBookEntities database framework. Once the record is added, the generated Id of the record is returned back.
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        public async Task<JsonResult> AddEntry()
        {
            try
            {
                // Add a new AddressRecord entry to the Entities
                // << YOUR CODE HERE >>
                var recordId = await Task.Run(() => {
                    AddressRecord record = dbContext.AddressRecords.Add(new AddressRecord
                    {
                        FirstName = "New",
                        LastName = "New"
                    });
                    dbContext.SaveChanges();
                    return record.Id;
                });
                return SuccessResult(recordId);
            }
            catch (Exception e)
            {
                return FailedResult(e);
            }
        }

        /// <summary>
        /// Retrieves all of the AddressRecord records, sorted alphabetically by last name and then by first name.
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public async Task<JsonResult> GetAllEntries()
        {
            try
            {
                // Retrieve all of the records
                // << YOUR CODE HERE >>
                var records = await dbContext.AddressRecords.ToListAsync();
                return SuccessResult(records);
            }
            catch (Exception e)
            {
                return FailedResult(e);
            }
        }

        /// <summary>
        /// Retrieves the record data provided in the object's Id property and then updates all properties in the record that are editable.
        /// Remember, First and Last Name are required, and a photo may be provided. Check that the photo is a jpeg, gif, png, or bmp before allowing it to upload,
        /// and ensure the image is less than 1MB to allow upload. If all checks pass, save the image as a PNG to the Uploads folder.
        /// </summary>
        /// <param name="recordData"></param>
        /// <returns></returns>
        [HttpPost]
        public async Task<JsonResult> SaveEntry(AddressRecord recordData)
        {
            try
            {
                using (var db = new AddressBookEntities())
                {
                    // Try to retrieve the record, and fail if the record doesn't exist
                    // << YOUR CODE HERE >>
                    AddressRecord record = await dbContext.AddressRecords.SingleOrDefaultAsync(x => x.Id == recordData.Id);
                    if (record == null)
                    {
                        return FailedResult("Record doesn't exist in database");
                    }
                    // Validate that the required fields have values
                    // << YOUR CODE HERE >>
                    if (string.IsNullOrEmpty(recordData.FirstName) || string.IsNullOrEmpty(recordData.LastName))
                    {
                        return FailedResult("Please enter all required fields");
                    }

                    var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".bmp" };
                    for (var i = 0; i < Request.Files.Count; i++)
                    {
                        // Get the file if it exists, and if not, just carry on
                        // << YOUR CODE HERE >>
                        HttpPostedFileBase file = Request.Files[i];
                        if (file == null)
                        {
                            continue;
                        }
                        // Check that the file has a valid name
                        // << YOUR CODE HERE >>
                        if (string.IsNullOrEmpty(file.FileName))
                        {
                            return FailedResult("File name is not valid");
                        }
                        // Validate the file size is less than 1MB
                        // << YOUR CODE HERE >>
                        if (file.ContentLength > 1024 * 1024)
                        {
                            return FailedResult("File size exceeds 1MB");
                        }

                        // Check that the photo is the correct type from the allowedExtensions
                        // << YOUR CODE HERE >>
                        string extension = Path.GetExtension(file.FileName);
                        if (!allowedExtensions.Contains(extension))
                        {
                            return FailedResult("File type is not allowed");
                        }

                        // All is well, save the image to memory, and then drop it in the Uploads folder with the Id as the name in PNG format
                        // << YOUR CODE HERE >>
                        WriteFile(recordData.Id+".png",file.InputStream);
                    }

                    // Update all record properties and save changes
                    // << YOUR CODE HERE >>
                    await Task.Run(() => {
                        record.LastName = recordData.LastName;
                        record.FirstName = recordData.FirstName;
                        record.City = recordData.City;
                        record.Address = recordData.Address;
                        record.AddressLine2 = recordData.AddressLine2;
                        record.Country = recordData.Country == "null" ? string.Empty : recordData.Country;
                        record.EmailAddress = recordData.EmailAddress;
                        record.PhoneNumber = recordData.PhoneNumber;
                        record.PostalZip = recordData.PostalZip;
                        record.ProvinceState = recordData.ProvinceState;
                        dbContext.SaveChanges();
                    });
                    return SuccessResult(recordData.Id);
                }
            }
            catch (Exception e)
            {
                return FailedResult(e);
            }
        }

        /// <summary>
        /// Copies the contents of input to output. Doesn't close either stream.
        /// </summary>
        private void CopyStream(Stream input, Stream output)
        {
            byte[] buffer = new byte[8 * 1024];
            int len;
            while ((len = input.Read(buffer, 0, buffer.Length)) > 0)
            {
                output.Write(buffer, 0, len);
            }
        }

        private void WriteFile(string fileName, Stream inputStream)
        {
            string path = Server.MapPath("~/Uploads/");
            if (System.IO.File.Exists(Path.Combine(path, fileName)))
            {
                System.IO.File.Delete(Path.Combine(path, fileName));
            }
            using (FileStream fs = new FileStream(Path.Combine(path, fileName), FileMode.CreateNew, FileAccess.Write))
            {
                CopyStream(inputStream, fs);
            }
            inputStream.Close();
            inputStream.Flush();
        }

        /// <summary>
        /// Deletes an entry from the Address Book
        /// </summary>
        /// <param name="recordId"></param>
        /// <returns></returns>
        [HttpPost]
        public async Task<JsonResult> DeleteEntry(int recordId)
        {
            try
            {
                // Get the record to delete, and fail if the record does not exist
                // << YOUR CODE HERE >>
                await Task.Run(() => {
                    AddressRecord record = dbContext.AddressRecords.SingleOrDefaultAsync(x => x.Id == recordId).Result;
                    dbContext.AddressRecords.Remove(record);
                    dbContext.SaveChanges();
                });
                return SuccessResult();
            }
            catch (Exception e)
            {
                return FailedResult(e);
            }
        }
    }
}