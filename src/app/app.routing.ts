import { NgModule } from "@angular/core";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { Routes } from "@angular/router";

import { MipScanComponent } from "./mip-scan/mip-scan.component";
import { MipControllerComponent } from "./mip-controller/mip-controller.component";
import { LightControllerComponent } from "./light-controller/light-controller-component";

const routes: Routes = [
    { path: "", redirectTo: "/mipscan", pathMatch: "full" },
    { path: "mipscan", component: MipScanComponent },
    { path: "mipcontroller/:UUID", component: MipControllerComponent },
    { path: "lightcontroller/:UUID", component: LightControllerComponent }
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule {}
