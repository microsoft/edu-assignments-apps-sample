# EDU Assignments Apps Sample

This sample demonstrates some best practices for Teams EDU Apps integrated with Assignments:
- Single sign-on (SSO)
- Consistent and accessible UX (via Fluent UI components)
- Content selection during App configuration


You will be able to run this app locally and attach an instance of it to an assignment.

## Prerequisites

- [NodeJS](https://nodejs.org/en/)
- An M365 account. If you do not have M365 account, apply one from [M365 developer program](https://developer.microsoft.com/en-us/microsoft-365/dev-program)
- [Teams Toolkit Visual Studio Code Extension](https://aka.ms/teams-toolkit) or [TeamsFx CLI](https://aka.ms/teamsfx-cli)

## Running the App

Start debugging the project by hitting the `F5` key in Visual Studio Code. Alternatively use the `Run and Debug Activity Panel` in Visual Studio Code and click the `Start Debugging` green arrow button.

<b>Note:</b> The first time you debug the app, the TeamsFx CLI module will create a Teams App with a unique application id in the [Teams Developer Portal](https://dev.teams.microsoft.com/home). It will also provision the necessary Azure resources (e.g. the Azure Active Directory App for supporting SSO authentication).

![Running the App](RunningTheApp.png)

Add the app to a class team (go through tab configuration and save the app in a new tab).

![Configuring the App](ConfiguringTheApp.png)

At this point, the app is installed as a [Teams Tab app](https://docs.microsoft.com/en-us/microsoftteams/platform/tabs/what-are-tabs).
The next section will guide you through attaching it to an assignment.

![App added to a Tab](InstalledApp.png)

### Assignments Integration

After you have run the app and added it to a class, the app will be available to attach to an assignment.
1. From an unpublished assignment, click the `...more` button to open the Teams app picker.
![...More button](More.png)
2. Select the "Assigments News Prompt" app.
![Choose an App](ChooseAnApp.png)
3. Go through the app configuration (e.g. select a news article, add a prompt).
4. Save the configuration.

The configured "Assignments News Prompt" instance is now attached to the assignment. When the assignment is assigned to students, a student will be able to launch the configured app instance and respond to the prompt. Note: Each student's responses will be tied to that student's unique id through use of SSO.

<b>Note:</b> All data created in the sample is stored locally in memory and will reset with each debug session.


## Contributing

This project welcomes contributions and suggestions.  Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit https://cla.opensource.microsoft.com.

When you submit a pull request, a CLA bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., status check, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

## Trademarks

This project may contain trademarks or logos for projects, products, or services. Authorized use of Microsoft 
trademarks or logos is subject to and must follow 
[Microsoft's Trademark & Brand Guidelines](https://www.microsoft.com/en-us/legal/intellectualproperty/trademarks/usage/general).
Use of Microsoft trademarks or logos in modified versions of this project must not cause confusion or imply Microsoft sponsorship.
Any use of third-party trademarks or logos are subject to those third-party's policies.
