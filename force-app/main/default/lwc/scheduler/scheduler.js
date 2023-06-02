import { LightningElement, api } from 'lwc';
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { loadStyle, loadScript } from "lightning/platformResourceLoader";
import { createRecord, updateRecord, deleteRecord } from "lightning/uiRecordApi";

// Static resources
import schedulerFiles from "@salesforce/resourceUrl/syncfusionscheduler";

// Controllers
import getEvents from "@salesforce/apex/SchedulerData.getEvents";

function getEventsData(eventData) {
    const data = eventData.events.map((a) => ({
        Id: a.Id,
        Subject: a.Name,
        Location: a.Location__c,
        StartTime: a.Start_Time__c,
        EndTime: a.End_Time__c,
        IsAllDay: a.IsAllDay__c,
        RecurrenceRule: a.RecurrenceRule__c,
        RecurrenceID: a.Recurrence_Id__c,
        RecurrenceException: a.RecurrenceException__c
    }));
 
    return data;
}

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
            selectedDate: new Date(),
            actionComplete: function (args) {
                //To perform CRUD in salesforce backend
                if (args.addedRecords && args.addedRecords.length > 0) {
                    var data = args.addedRecords[0];
                    var insert = {
                        apiName: "SchedulerEvent__c",
                        fields: {
                            Name: data.Subject,
                            Location__c: data.Location,
                            Start_Time__c: data.StartTime,
                            End_Time__c: data.EndTime,
                            IsAllDay__c: data.IsAllDay,
                            RecurrenceRule__c: data.RecurrenceRule,
                            Recurrence_Id__c: data.RecurrenceID,
                            RecurrenceException__c: data.RecurrenceException
                        }
                    };
                    createRecord(insert).then((res) => {
                        if (scheduleObj)
                        {
                            scheduleObj.eventSettings.dataSource[scheduleObj.eventSettings.dataSource.length - 1].Id = res.id;
                            scheduleObj.refreshEvents();
                        }
                        return { tid: res.id, ...res };
                    });
                }
                if (args.changedRecords && args.changedRecords.length > 0) {
                    var data = args.changedRecords[0];
                    var update = {
                        fields: {
                            Id: data.Id,
                            Name: data.Subject,
                            Location__c: data.Location,
                            Start_Time__c: data.StartTime,
                            End_Time__c: data.EndTime,
                            IsAllDay__c: data.IsAllDay,
                            RecurrenceRule__c: data.RecurrenceRule,
                            RecurrenceException__c: data.RecurrenceException,
                            Recurrence_Id__c: data.RecurrenceID
                        }
                    };
                    updateRecord(update).then(() => ({}));
                }
                if (args.deletedRecords && args.deletedRecords.length > 0) {
                    args.deletedRecords.forEach(event => {
                        deleteRecord(event.Id).then(() => ({}));
                    });
                }
            }
        };
        const scheduleObj = new ej.schedule.Schedule(scheduleOptions, root);

        getEvents().then((data) => {
            const eventData = getEventsData(data);
            scheduleObj.eventSettings.dataSource = eventData;
            scheduleObj.dataBind();
        });
    }
}