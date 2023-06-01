import { LightningElement, api } from 'lwc';
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { loadStyle, loadScript } from "lightning/platformResourceLoader";

// Static resources
import schedulerFiles from "@salesforce/resourceUrl/syncfusionscheduler";

export default class Scheduler extends LightningElement {
    static delegatesFocus = true;

    @api height;
    schedulerInitialized = false;

    renderedCallback() {
        if (this.schedulerInitialized) {
            return;
        }
        this.schedulerInitialized = true;

        Promise.all([
            loadScript(this, schedulerFiles + "/syncscheduler.js"),
            loadStyle(this, schedulerFiles + "/syncscheduler.css")
        ])
            .then(() => {
                this.initializeUI();
            })
            .catch((error) => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: "Error loading scheduler",
                        message: error.message,
                        variant: "error"
                    })
                );
            });
    }

    initializeUI() {
        const root = this.template.querySelector(".syncfusionscheduler");
        root.style.height = this.height + "px";
        const scheduleOptions = {
            height: this.height + "px",
            selectedDate: new Date(2021, 0, 10),
            actionComplete: function (args) {
                if (args.requestType === 'eventCreated') {
                    console.log(args.addedRecords);
                }
                if (args.requestType === 'eventChanged') {
                    console.log(args.changedRecords);
                }
                if (args.requestType === 'eventRemoved') {
                    console.log(args.deletedRecords);
                }

            }
        };
        new ej.schedule.Schedule(scheduleOptions, root);
    }

}