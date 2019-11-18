import { Component, OnInit, NgZone } from "@angular/core";
import * as bluetooth from "nativescript-bluetooth";
import { Peripheral } from "nativescript-bluetooth";
import { Router } from "@angular/router";
import { Observable, Subscription } from "rxjs";
import { distinctUntilChanged } from "rxjs/operators";

@Component({
    selector: "mip-scan",
    moduleId: module.id,
    templateUrl: "./mip-scan.component.html",
    styleUrls: ["./mip-scan.component.css"]
})
export class MipScanComponent implements OnInit {
    isEnabledSubscription: Subscription;
    isBluetoothEnabled = false;

    devices: any[] = [
        {
            UUID: "1C:05:21:4C:5E:04",
            name: "MIP"
        },
        {
            UUID: "FC:58:FA:C1:76:47",
            name: "Lamp"
        }
    ];

    constructor(private router: Router) {
        bluetooth.setCharacteristicLogging(false);
    }

    ngOnInit() {
        // bluetooth.requestCoarseLocationPermission();
        // if no permission was granted previously this will open a user consent screen
        bluetooth.requestCoarseLocationPermission().then(function(granted) {
            console.log("Location permission requested, user granted? " + granted);
        });

        this.isEnabledSubscription = this.listenToBluetoothEnabled().subscribe(enabled => (this.isBluetoothEnabled = enabled));
    }

    public listenToBluetoothEnabled(): Observable<boolean> {
        return new Observable<boolean>(observer => {
            bluetooth.isBluetoothEnabled().then(enabled => observer.next(enabled));

            let intervalHandle = setInterval(() => {
                bluetooth.isBluetoothEnabled().then(enabled => observer.next(enabled));
            }, 1000);

            // stop checking every second on unsubscribe
            return () => clearInterval(intervalHandle);
        }).pipe(distinctUntilChanged());
    }

    addDevice(name: string, UUID: string) {
        this.devices.push({ name, UUID });
    }

    scan() {
        this.devices = [];
        console.log("scan");
        bluetooth.startScanning({
            skipPermissionCheck: true,
            seconds: 5,
            // name: "Mip-52932",
            // serviceUUIDs: ['ffe5'],
            // serviceUUIDs: ['0000ffe5-0000-1000-8000-00805f9b34fb'],
            onDiscovered: (peripheral: Peripheral) => {
                console.log("uuid=", peripheral.UUID);
                // if(peripheral.name) {
                //   console.log(`UUID: ${peripheral.UUID} name: ${peripheral.name}`)
                //   this.devices.push(peripheral);
                // }
            }
        });
    }

    connectMip(UUID: string) {
        // this.router.navigate(["mipcontroller", UUID]);
        bluetooth.connect({
            UUID: UUID,
            onConnected: (peripheral: Peripheral) => {
                console.log("Connected");
                this.router.navigate(["mipcontroller", UUID]);
            },
            onDisconnected: (peripheral: Peripheral) => {
                this.router.navigate(["mipscan"]);
            }
        });
    }

    connectLight(UUID: string) {
        // this.router.navigate(["lightcontroller", UUID]);
        bluetooth.connect({
            UUID: UUID,
            onConnected: (peripheral: Peripheral) => {
                console.log("Connected");
                this.router.navigate(["lightcontroller", UUID]);
            },
            onDisconnected: (peripheral: Peripheral) => {
                this.router.navigate(["mipscan"]);
            }
        });
    }

    navigateToController(UUID: string) {
        this.router.navigate(["mipcontroller", UUID]);
    }
}
