# JavaScript Scheduler Integration with Salesforce Platform

A complete integration of [JavaScript Scheduler](https://www.syncfusion.com/javascript-ui-controls/js-scheduler) with Salesforce, enabling event management and synchronization within the Salesforce ecosystem as a custom component.

### Prerequisites

- [Salesforce CLI](https://developer.salesforce.com/tools/sfdxcli)

### Setup Salesforce

1. [Sign up](https://developer.salesforce.com/signup) with a Salesforce developer account
2. [Log in](https://login.salesforce.com/) and enable Dev Hub in Setup > My Domain
3. Search for `Dev hub` in the quick find and enable it if needed

### Deployment

1. Clone this project
2. Update `salesforce\scheduler-salesforce-app\sfdx-project.json` with your domain URL from Salesforce Setup > My Domain
3. Authorize DevHub: `sf org login web --set-default-dev-hub`
4. Create scratch org: `sf org:create:scratch -f config/project-scratch-def.json`
5. Open scratch org: `sf org:open -o {scratch org user name}`
6. Deploy: `sf project:deploy:start -o {scratch org use name}`


### Integration

1. Open your scratch org and click the app launcher icon
2. Search for `SyncfusionScheduler` to load the scheduler as a custom component 

### Output Preview

![Preview](image.png)

### Documentation

- [JavaScript Introduction](https://ej2.syncfusion.com/javascript/documentation/introduction)
- [JavaScript Schedule Component](https://ej2.syncfusion.com/javascript/documentation/schedule/getting-started)

### Troubleshooting 

**License banner:** Register a Syncfusion license key at the [Licensing Overview](https://ej2.syncfusion.com/javascript/documentation/licensing/overview).