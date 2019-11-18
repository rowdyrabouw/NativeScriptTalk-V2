import { Component, OnInit } from "@angular/core";
import * as bluetooth from "nativescript-bluetooth";
import { ActivatedRoute } from "@angular/router";

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

    constructor(private route: ActivatedRoute) {}

    ngOnInit() {
        this.deviceUUID = this.route.snapshot.params["UUID"];
        this.writeColor("#000000");
    }

    showRainbow() {
        console.log("showRainbow");
        this.loopColors(0);
    }

    loopColors(index) {
        const colors = ["#000000", "#f23b9e", "#f80d26", "#f88021", "#700a83", "#fae722", "#253698", "#1a85bd", "#1d9730"];

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

    disconnect() {
        bluetooth
            .disconnect({
                UUID: this.deviceUUID
            })
            .then(
                function() {
                    console.log("disconnected successfully");
                },
                function(err) {
                    // in this case you're probably best off treating this as a disconnected peripheral though
                    console.log("disconnection error: " + err);
                }
            );
    }
}
