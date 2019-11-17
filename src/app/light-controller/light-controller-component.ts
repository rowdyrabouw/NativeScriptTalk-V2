import { Component, OnInit } from "@angular/core";
import * as bluetooth from "nativescript-bluetooth";
import { ActivatedRoute } from "@angular/router";
import { SpeechRecognition, SpeechRecognitionTranscription, SpeechRecognitionOptions } from "nativescript-speech-recognition";
import { ChangeDetectorRef } from "@angular/core";

@Component({
    selector: "light-controller",
    moduleId: module.id,
    templateUrl: "./light-controller-component.html",
    styleUrls: ["./light-controller-component.css"]
})
export class LightControllerComponent implements OnInit {
    serviceUUID: string = "cc02";
    characteristicUUID: string = "ee03";
    deviceUUID: string = "";
    transcription = { text: "" };

    constructor(private route: ActivatedRoute, private change: ChangeDetectorRef, private speechRecognition: SpeechRecognition) {}

    ngOnInit() {
        this.deviceUUID = this.route.snapshot.params["UUID"];
        this.writeColor("#09CE19");
        this.speechRecognition.requestPermission().then((granted: boolean) => {
            console.log("Granted? " + granted);
        });
        this.triggerListening();
    }

    triggerListening() {
        this.speechRecognition
            .available()
            .then(available => {
                available ? this.listen() : alert("Speech recognition is not available!");
            })
            .catch(error => console.error(error));
    }

    listen() {
        const options: SpeechRecognitionOptions = {
            locale: "en-US",
            onResult: (transcription: SpeechRecognitionTranscription) => {
                console.log(`Text: ${transcription.text}, Finished: ${transcription.finished}`);
                this.transcription = transcription;
                this.change.detectChanges();
            }
        };

        this.speechRecognition
            .startListening(options)
            .then(() => console.log("Started listening"))
            .catch(error => console.error(error));
    }

    stopListening() {
        this.speechRecognition
            .stopListening()
            .then(() => console.log("Stopped listening."))
            .catch(error => console.error(error));
    }

    showRainbow() {
        console.log("showRainbow");
        this.loopColors(0);
    }

    loopColors(index) {
        const colors = [
            "#000000",
            "#ff0000",
            "#ff8000",
            "#ffff00",
            "#80ff00",
            "#00ff00",
            "#00ff80",
            "#00ffff",
            "#0080ff",
            "#0000ff",
            "#8000ff",
            "#ff0080"
        ];

        if (index < colors.length) {
            setTimeout(() => {
                console.log(colors[index]);
                this.writeColor(colors[index]);
                index++;
                this.loopColors(index);
            }, 750);
        }
    }

    writeColor(color) {
        bluetooth.writeWithoutResponse({
            serviceUUID: this.serviceUUID,
            characteristicUUID: this.characteristicUUID,
            peripheralUUID: this.deviceUUID,
            value: this.hexToRgbToValue(color)
        });
    }

    hexToRgbToValue(color) {
        var c = parseInt(color.substring(1), 16);
        var r = (c >> 16) & 255;
        var g = (c >> 8) & 255;
        var b = c & 255;
        return new Uint8Array([0x01, g, 0x01, 0x00, 0x01, b, 0x01, r, 0x01, 0x00]);
    }

    rgbToHex(red, green, blue) {
        var rgb = blue | (green << 8) | (red << 16);
        return "#" + (0x1000000 + rgb).toString(16).slice(1);
    }
}
