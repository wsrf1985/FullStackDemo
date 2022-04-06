# ITSM Process & Operations - Technology - Coding Exercise

The purpose of this exercise is to demonstrate your ability to use different JavaScript and C# functions to create a working Address Book. The user interface is provided for you; it is your task to code in the blanks. This project is built on .NET MVC.

<strong>Prerequisites</strong>
<ul>
<li>A Windows based computer (Mac OS is not supported)</li>
<li><a href="https://visualstudio.microsoft.com/" target="_blank">Visual Studio 2019 or Greater (Any Edition)</a></li>
<li><a href="https://dotnet.microsoft.com/download/dotnet-framework/thank-you/net48-developer-pack-offline-installer" target="_blank">.NET 4.8 Developer Pack</a></li>
<li>This project, which can be downloaded via the 'Code' -> 'Download ZIP' button. <strong>Do not create a fork of the project.</strong></li>
</ul>

There are two areas where you will be writing code:
<ul>
<li>Controllers/HomeController.cs</li>
<li>Scripts/app.js</li>
</ul>

And the tasks that you will be required to complete:

<strong>For HomeController.cs</strong>
<ul>
<li>Reading a list of countries from a provided JSON file and mapping the data to a CountryView class</li>
<li>Adding an entry to the AddressBookEntities with a pre-set First and Last Name</li>
<li>Retrieving a list of all entries from the database</li>
<li>Saving an entry to the AddressBookEntities and uploading a photo (any photo, provided by you)</li>
<li>Deleting an entry</li>
</ul>

<strong>For app.js</strong>
<ul>
<li>Retrieve all address book records from the controller</li>
<li>Retrieve all countries from the controller and populate the dropdown with the entries</li>
<li>Display all of the records retrieved</li>
<li>Create a new entry and immediately editing the record after successful creation</li>
<li>Selecting a record and displaying the populated data for a record</li>
<li>Editing a record and updating the user interface</li>
<li>Saving an entry and passing form data to the controller</li>
<li>Deleting an entry</li>
</ul>

<strong>Helpful Tips!</strong>
<ul>
<li>CSS classes for the front end are all provided in Content/site.css -- be sure to use them for your front end display</li>
<li>The database and Entity Framework connection has already been set up for you. Database tasks can be accessed by creating an instance of AddressBookEntities</li>
<li>All JsonResults being returned from the back end must fail gracefully if an error occurs, and displayed to the end user</li>
<li>All generic functions are provided, and stubs of all methods are provided along with comments to help guide you</li>
<li>Remember to show the loading overlay when calling an interactive function that has to wait for a result, and then hiding it when complete</li>
<li>The solution is ready to run, all NuGet packages will just need to be restored. Do not upgrade any NuGet packages or the project may not build</li>
<li>All back end controller functions that do any database access must use asynchronous programming methods</li>
<li>Complete as much of the task as possible. More code complete means a higher score</li>
  <li>Be creative! There is more than one way to have a working solution.</li>
  <li>Don't be afraid to use online resources to help in figuring out syntax for specific functions.</li>
</ul>

<h3>!! Important !!</h3>
<strong>When finished as much of the challenge as you can, the solution must be uploaded to your GitHub and the repository URL provided to the interview panel before your interview begins, or if you have already had your interview, your code must be submitted by the deadline provided. If you do not have a GitHub account, you will be required to create one. If a repository URL is not provided, a score of 0 will be issued for your coding test.</strong><br/><br/>

<strong>Do not commit any of your code or files to this repository! Your code must be uploaded to your own Github account.</strong><br/><br/>

<strong>Screenshots of Final Project</strong>

Below are some screenshots to show what the final display is expected to look like.

![ss1](https://user-images.githubusercontent.com/40478741/124629308-51239080-de4f-11eb-8c17-8128807b82ea.png)
![ss2](https://user-images.githubusercontent.com/40478741/124629330-554fae00-de4f-11eb-8d76-a24435561eb2.png)
![ss3](https://user-images.githubusercontent.com/40478741/124629343-58e33500-de4f-11eb-8c2d-b54f34a50c48.png)
