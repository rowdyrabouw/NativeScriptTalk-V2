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
    serviceUUID: string = "0xcc02";
    characteristicUUID: string = "0xee03";
    deviceUUID: string = "";

    constructor(private route: ActivatedRoute) {}

    ngOnInit() {
        this.deviceUUID = this.route.snapshot.params["UUID"];
    }

    rgbToHex(red, green, blue) {
        var rgb = blue | (green << 8) | (red << 16);
        return "#" + (0x1000000 + rgb).toString(16).slice(1);
    }
}
