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

    constructor(private route: ActivatedRoute, private colorPicker: ColorPicker) {}

    ngOnInit() {
        this.deviceUUID = this.route.snapshot.params["UUID"];
        this.writeColor("#09CE19");
    }

    showRainbow() {
        console.log("showRainbow");
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
