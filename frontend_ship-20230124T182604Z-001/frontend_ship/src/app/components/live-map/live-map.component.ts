import { Component, OnInit, AfterViewInit, OnDestroy } from "@angular/core";
import { ServiceService } from "../shared/service.service";
import { ToastrService } from "ngx-toastr";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import TileWMS from "ol/source/TileWMS";
import { defaults as defaultControls } from "ol/control";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import "ol/ol.css";
import { Vector as VectorLayer, Group as LayerGroup } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import { Feature } from "ol/index";
import { MultiLineString } from "ol/geom";
import { Point } from "ol/geom";
import { Style, Icon } from "ol/style";
import MousePosition from "ol/control/MousePosition";
import { createStringXY } from "ol/coordinate";
import Overlay from "ol/Overlay";
import { formatDate } from "@angular/common";
import Stroke from "ol/style/Stroke";
import Graticule from "ol/layer/Graticule";
import { CookieService } from "ngx-cookie-service";
import { WebGLPoints } from "ol/layer";
import Draw, { createBox, createRegularPolygon } from "ol/interaction/Draw";
import Polygon from "ol/geom/Polygon";
import GeoJSON from "ol/format/GeoJSON";
import { DataService } from "../shared/Data.service";
import { FunctionService } from "../shared/functions.service";
import { Subscription } from "rxjs";
import Fill from "ol/style/Fill";
declare var gifler: any;
import { containsXY } from "ol/extent";

@Component({
  selector: "app-live-map",
  templateUrl: "./live-map.component.html",
  styleUrls: ["./live-map.component.scss"],
})
export class LiveMapComponent implements OnInit, AfterViewInit, OnDestroy {
  computationMessage = "";
  allshipsData = [];
  map: Map;
  destination: any;
  localtime: any;
  calibreateddatetime: any;
  userId: any;
  selectedmmsi: any;
  soiflag: any;
  goiflag: any;
  rolefeatures: any;
  ShipSource = new VectorSource();
  PredictedAnchorsSource = new VectorSource();
  KnownAnchorsSource = new VectorSource();
  PortsSource = new VectorSource();
  loginStatus: string;
  isExpanded = false;
  graticule = false;
  maptype: any;
  digitaltime: any;
  digitaldate: any;
  clockStatus: boolean;
  plottimerfunction: any;
  isFav = false;
  togroup = false;
  speed: string;
  selectedpopupData: any;
  soifeatureisselected = "false";
  // goi
  goisubmitted = false;
  goiforpopup: any;
  goiforpopuplength: any;
  editinggroupname: any;
  editgoisubmitted = false;
  deletingsoiship = "";
  deletingSoiShipName = "";
  deletinggoiship = "";
  deletingmmsiofgoi = "";
  deletingmmsiofgoiship = "";
  // ROI
  draw: any;
  regionsubmitted = false;
  editingregion: any;
  collapseNav = true;
  editregionsubmitted = false;
  deletingroi: any;
  deletingregionname = "";
  knownanchors = [];
  checkedknownanchors = false;
  predictedanchors = [];
  checkedpredictanchors = false;
  ports = [];
  checkedports = false;
  checkedanchors = false;
  progressbar = false;
  adjustedClock: any;
  modelName = "";
  predictedclasstype = [];
  predictedclasstypelength = 0;
  predictedclassmodeltime: any;
  predictedclasspreprocesstime: any;
  predictionOptions = [];
  labelCount: number;
  dataUrl = [];
  predictclass: boolean;
  predictdestination: boolean;
  refreshrate: any;
  plotshipapicount = 0;
  plotshipapiflag = 0;
  soisub: Subscription;

  predictedDestination = "";
  pastTrackData = [];
  shipstyle = {
    symbol: {
      symbolType: "image",
      src: "../../../assets/IMSAS_ICONS_20.png",
      size: ["clamp", ["*", ["zoom"], 5], 5, 150],
      text: ["get", "mmsi"],
      color: [
        "match",
        ["get", "coo"],
        "China",
        "#000000",
        "Hong Kong",
        "#000000",
        "Pakistan",
        "#A52A2A",
        "Bangladesh",
        "#A52A2A",
        "#008000",
      ],
      // color: ['get', 'shipColor'],
      rotateWithView: true,
      offset: [0, 0],
      textureCoord: [
        "match",
        ["get", "category"],
        "Tanker",
        [0, 0, 0.25, 0.25],
        "Tank",
        [0, 0, 0.25, 0.25],
        "Passenger",
        [0.25, 0, 0.5, 0.25],
        "High Speed",
        [0.5, 0, 0.75, 0.25],
        "HSC",
        [0.5, 0, 0.75, 0.25],
        "Fishing",
        [0.75, 0, 1, 0.25],
        "Pleasure",
        [0.5, 0.25, 0.75, 0.5],
        "Other",
        [0.5, 0.25, 0.75, 0.5],
        "Unknown",
        [0.5, 0.25, 0.75, 0.5],
        "Law Enforcement",
        [0.5, 0.25, 0.75, 0.5],
        [0.5, 0.25, 0.75, 0.5],
      ],
      rotation: ["*", ["get", "cog"], Math.PI / 180],
      opacity: 0.8,
    },
  };

  trajpointsStyle = {
    symbol: {
      symbolType: "image",
      src: "../../assets/Circle-Boat_arrow.png",
      rotateWithView: true,
      size: ["match", ["get", "indexVal"], "index:0", 20, "index:last", 20, 10],
      color: [
        "match",
        ["get", "indexVal"],
        "index:0",
        "#FF0000",
        "index:last",
        "#008000",
        "#FFFF00",
      ],
      offset: [0, 0],
      textureCoord: [
        "match",
        ["get", "indexVal"],
        "index:0",
        [0, 0, 0.5, 0.5],
        "index:last",
        [0.5, 0, 1, 1],
        [0, 0.5, 0.5, 1],
      ],
      rotation: ["*", ["get", "cog"], Math.PI / 180],
      opacity: 0.8,
    },
  };

  // Density Map
  rangeValues = [];
  // End Density Map

  editingPresetId = "";
  editingPresetName = "";
  editpresetsubmitted = false;

  deletingPresetId = "";
  deletingPresetName = "";
  vfship: any;

  searchFlag: boolean;
  searchedRequestData: any;
  opacitySildervalue = parseFloat("1");
  shipsColors: any;
  constructor(
    private service: ServiceService,
    private toastr: ToastrService,
    private cookieService: CookieService,
    private Dataservice: DataService,
    private functionservice: FunctionService
  ) {}

  goiFrom = new FormGroup({
    userid: new FormControl(""),
    mmsi: new FormControl(),
    group_name: new FormControl("", [Validators.required]),
    flag: new FormControl(""),
  });

  get g(): any {
    return this.goiFrom.controls;
  }

  regionFrom = new FormGroup({
    roi: new FormControl("", [Validators.required]),
    coord: new FormControl(""),
    userid: new FormControl(""),
  });

  get r(): any {
    return this.regionFrom.controls;
  }

  editregionForm = new FormGroup({
    old_roi: new FormControl(""),
    new_roi: new FormControl("", [Validators.required]),
    top_left_coord: new FormControl(""),
    top_right_coord: new FormControl(""),
    bottom_left_coord: new FormControl(""),
    bottom_right_coord: new FormControl(""),
    userid: new FormControl(""),
  });

  get er(): any {
    return this.editregionForm.controls;
  }

  editgoiForm = new FormGroup({
    old_goi: new FormControl(""),
    new_goi: new FormControl("", [Validators.required]),
    userid: new FormControl(""),
  });

  get eg(): any {
    return this.editgoiForm.controls;
  }

  editpresetForm = new FormGroup({
    pid: new FormControl(""),
    pname: new FormControl("", [Validators.required]),
  });

  get ep(): any {
    return this.editpresetForm.controls;
  }
  setPredImageForm = new FormGroup({
    predtype: new FormControl(),
  });

  ngOnInit(): void {
    this.loginStatus = this.cookieService.get("loginStatus");
    if (this.loginStatus === "true") {
      this.shipsColors = JSON.parse(this.cookieService.get("shipColors"));
      this.maptype = this.cookieService.get("map");
      this.userId = this.cookieService.get("userid");
      this.refreshrate = this.cookieService.get("refreshrate");
      this.service.setTitle("Ship-Map");
      // this.soisub = this.Dataservice.SOI.subscribe(message => {
      //   if (message === 'true') {
      //     this.ngOnDestroy();
      //     this.startLiveMap();
      //   }
      // });
    }
    this.labelCount = 2;
    this.Dataservice.changedtoSOI("");
    this.Dataservice.changedtoROI("");
    this.Dataservice.changedtoVF("");
  }

  // After view init render map
  ngAfterViewInit(): void {
    this.displayMap();
  }

  // Get all ships data
  getAllShips(): void {
    this.progressbar = true;
    document
      .getElementById("disable-mapevent")
      .setAttribute("style", "cursor:progress;pointer-events:none");
    document.getElementById("overall").setAttribute("style", "cursor: wait;");
    const refreshAt = Number(this.refreshrate) * 1000;
    this.adjustedClock = this.cookieService.get("adjustedClock");
    if (this.adjustedClock === "true") {
      this.calibreateddatetime = this.localtime;
      this.getshipsApicall();
    } else {
      this.calibreateddatetime = this.functionservice.getCalibratedTime(
        this.localtime,
        this.speed,
        refreshAt
      );
      this.getshipsApicall();
    }
    this.callingInLoop();
  }

  // calling get all ships in loop
  callingInLoop(): void {
    const refreshAt = Number(this.refreshrate) * 1000;
    this.plottimerfunction = setInterval(() => {
      this.adjustedClock = this.cookieService.get("adjustedClock");
      if (this.adjustedClock === "true") {
        this.calibreateddatetime = this.localtime;
        this.getshipsApicall();
      } else {
        this.calibreateddatetime = this.functionservice.getCalibratedTime(
          this.localtime,
          this.speed,
          refreshAt
        );
        this.getshipsApicall();
      }
    }, refreshAt);
  }

  // get all ships api call
  getshipsApicall(): void {
    const startDate = new Date();
    const functionName = "Get ships data in ship map";
    this.functionservice.functionCallLogging(functionName);
    this.plotshipapiflag = this.plotshipapiflag + 1;
    const reqData = {
      timestamp: this.calibreateddatetime,
      userid: this.userId,
      mmsilist: [],
      flag: this.plotshipapiflag,
    };
    this.service.getShips(reqData).subscribe(
      (result) => {
        if (result.status === "success") {
          if (this.plotshipapiflag === Number(result.flag)) {
            this.plotshipapicount = 0;
            this.allshipsData = result.data;
            this.localtime = result.timestamp;
            this.Dataservice.changeVesselCount(result.count);
            this.cookieService.set("localtime", this.localtime);
            this.digitaldate = formatDate(
              this.localtime,
              "dd/MM/yyyy",
              "en-US"
            );
            this.digitaltime = formatDate(this.localtime, "HH:mm:ss", "en-US");
            if (document.getElementById("digitaldate") !== null) {
              document.getElementById("digitaldate").innerHTML =
                this.digitaldate;
            }
            if (document.getElementById("digitaltime") !== null) {
              document.getElementById("digitaltime").innerHTML =
                this.digitaltime;
            }
            this.plotShips(this.allshipsData);
          } else {
            this.plotshipapicount = this.plotshipapicount + 1;
            this.localtime = this.calibreateddatetime;
            document
              .getElementById("disable-mapevent")
              .setAttribute("style", "cursor:default;");
            document
              .getElementById("overall")
              .setAttribute("style", "cursor: default;");
            this.progressbar = false;
          }

          if (this.plotshipapicount >= 10) {
            this.computationMessage =
              "Check your network connection or contact admin.";
            document.getElementById("opensoiroicomputation").click();
            this.plotshipapicount = 0;
            document
              .getElementById("disable-mapevent")
              .setAttribute("style", "cursor:default;");
            document
              .getElementById("overall")
              .setAttribute("style", "cursor: default;");
            this.progressbar = false;
          }

          const endDate = new Date();
          const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
          this.functionservice.successLogging(
            functionName + " success",
            seconds
          );
        }
      },
      (error) => {
        const endDate = new Date();
        const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
        this.functionservice.PostErrorCond(error, functionName, seconds);
        this.plotShips([]);
      }
    );
  }

  // get all ships api call
  getAllShips_withoutloop(): void {
    const startDate = new Date();
    const functionName = "Get ships data in ship map";
    this.functionservice.functionCallLogging(functionName);
    this.plotshipapiflag = this.plotshipapiflag + 1;
    this.progressbar = true;
    document
      .getElementById("disable-mapevent")
      .setAttribute("style", "cursor:progress;pointer-events:none");
    document.getElementById("overall").setAttribute("style", "cursor: wait;");
    const reqData = {
      timestamp: this.localtime,
      userid: this.userId,
      mmsilist: [],
      flag: this.plotshipapiflag,
    };
    this.service.getShips(reqData).subscribe(
      (result) => {
        if (result.status === "success") {
          if (this.plotshipapiflag === Number(result.flag)) {
            this.plotshipapicount = 0;
            this.allshipsData = result.data;
            this.Dataservice.changeVesselCount(result.count);
            this.plotShips(this.allshipsData);
          } else {
            this.plotshipapicount = this.plotshipapicount + 1;
            document
              .getElementById("disable-mapevent")
              .setAttribute("style", "cursor:default;");
            document
              .getElementById("overall")
              .setAttribute("style", "cursor: default;");
            this.progressbar = false;
          }

          if (this.plotshipapicount >= 10) {
            this.computationMessage =
              "Check your network connection or contact admin.";
            document.getElementById("opensoiroicomputation").click();
            this.plotshipapicount = 0;

            document
              .getElementById("disable-mapevent")
              .setAttribute("style", "cursor:default;");
            document
              .getElementById("overall")
              .setAttribute("style", "cursor: default;");
            this.progressbar = false;
          }

          const endDate = new Date();
          const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
          this.functionservice.successLogging(
            functionName + " success",
            seconds
          );
        }
      },
      (error) => {
        const endDate = new Date();
        const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
        this.functionservice.PostErrorCond(error, functionName, seconds);
        this.plotShips([]);
      }
    );
  }

  // Display map
  displayMap(): void {
    this.maptype = this.cookieService.get("map");
    const container = document.getElementById("popup");
    const overlay = new Overlay({
      element: container,
      positioning: "center-center",
    });

    this.map = new Map({
      controls: defaultControls({ zoom: false }).extend([
        new MousePosition({
          coordinateFormat: createStringXY(4),
          projection: "EPSG:4326",
          undefinedHTML: "&nbsp;",
        }),
      ]),
      overlays: [overlay],
      target: "map",
      view: new View({
        center: [78, 20],
        zoom: 4,
        // maxZoom: 15,
        projection: "EPSG:4326",
      }),
    });
    this.map.on("pointerdrag", () => {
      if (this.progressbar === false) {
        document.getElementById("map").setAttribute("style", "cursor: grab");
      } else {
        document.getElementById("map").setAttribute("style", "cursor: wait");
      }
    });
    const map = [
      { mapname: "Standard Map", layername: "osm" },
      { mapname: "Satellite Map", layername: "simple_dark" },
      { mapname: "Nautical Map", layername: "ENC" },
    ];

    map.forEach((maptype) => {
      let visibility;
      if (maptype.mapname === this.maptype) {
        visibility = true;
      } else {
        visibility = false;
      }
      let workspace;
      if (maptype.layername === "ENC") {
        workspace = "ENC_Workspace";
      } else {
        workspace = "osm";
      }
      // amal
      /* let layerG = new LayerGroup({
        name: maptype.mapname,
        layers: [
          new TileLayer({
            source: new TileWMS({
              url: this.service.mapURL + workspace + '/wms',
              params: { LAYERS: maptype.layername, TILED: true },
            }),
            // name: maptype.mapname,
            visible: visibility
          }),
          new VectorLayer({
            source: new VectorSource({
              url: '../../../assets/map/india-land-simplified.json',
              format: new GeoJSON()
            }),
            name: "indiaBorder",
            style: new Style({
              stroke: new Stroke({
                color: "#D6ABD1",
                width: 3
              })
            })
          }),
        ]
      }) */
      // amal
      this.map.addLayer(
        new TileLayer({
          source: new TileWMS({
            url: this.service.mapURL + workspace + "/wms",
            // url: 'http://20.20.20.112:8090/geoserver/ENC_Workspace/wms',
            params: { LAYERS: maptype.layername, TILED: false },
            // serverType: 'geoserver',
            // transition: 0,
          }),
          name: maptype.mapname,
          visible: visibility,
        })
      );
    });

    const closer = document.getElementById("popup-closer");
    if (closer !== null) {
      closer.onclick = (): boolean => {
        overlay.setPosition(undefined);
        closer.blur();
        const popupfav = document.getElementById("popup-fav");
        if (popupfav !== null) {
          document
            .getElementById("popup-fav")
            .setAttribute("style", "display:none");
        }
        const popupgroup = document.getElementById("popup-group");
        if (popupgroup !== null) {
          document
            .getElementById("popup-group")
            .setAttribute("style", "display:none");
        }
        return false;
      };
    }
    this.map.on("singleclick", (e) => {
      if (this.progressbar === false) {
        document.getElementById("map").setAttribute("style", "cursor: default");
      } else {
        document.getElementById("map").setAttribute("style", "cursor: wait");
      }
      const popupfav = document.getElementById("popup-fav");
      if (popupfav !== null) {
        document
          .getElementById("popup-fav")
          .setAttribute("style", "display:none");
      }

      const popupgroup = document.getElementById("popup-group");
      if (popupgroup !== null) {
        document
          .getElementById("popup-group")
          .setAttribute("style", "display:none");
      }
      if (document.getElementById("popup-search") !== null) {
        document
          .getElementById("popup-search")
          .setAttribute("style", "display:none");
      }
      const featureData = e.map.forEachFeatureAtPixel(
        e.pixel,
        (feature): any => {
          return feature;
        },
        {
          layerFilter: (layer): any => {
            return (
              layer.get("name") === "ShipLayer" ||
              layer.get("name") === "SOILayer" ||
              layer.get("name") === "ROILayer" ||
              layer.get("name") === "VFLayer" ||
              layer.get("name") === "DMLayer"
            );
          },
        }
      );

      if (featureData) {
        const ship = featureData.get("shipData");
        this.vfship = ship;
        this.modelName = "";
        this.predictedclasstype = [];
        this.predictedclasstypelength = 0;
        this.predictedclasspreprocesstime = "";
        this.predictedclassmodeltime = "";
        this.predictedDestination = "";

        // clear predicted line.

        this.map
          .getLayers()
          .getArray()
          .filter(
            (layer) =>
              layer.get("name") === "Predict Route" ||
              layer.get("name") === "Predict Route points" ||
              layer.get("name") === "Past Route" ||
              layer.get("name") === "Past Route points" ||
              layer.get("name") === "Predict Destination Layers" ||
              layer.get("name") === "Highlight Predict Destination Layers" ||
              layer.get("name") === "VF Route" ||
              layer.get("name") === "VF Route points"
          )
          .forEach((layer) => {
            layer.getSource().clear();
            this.map.removeLayer(layer);
          });

        // amal
        const startDate = new Date();
        const functionName = "Get ship details in ship map";
        this.functionservice.functionCallLogging(functionName);
        this.service.getShipDetails(ship.msi, ship.tm, this.userId).subscribe(
          (result) => {
            if (result.status === "success") {
              this.selectedpopupData = result.data;
              this.selectedpopupData.ct = ship.ct;
              document
                .getElementById("popup")
                .setAttribute("style", "display:block");
              // const coordinate = e.coordinate;
              document.getElementById("shipname").innerHTML = ship.sn;
              document.getElementById("shipmmsi").innerHTML =
                "MMSI: " + ship.msi;
              const shipCatSVG =
                '<svg style="border: 1px solid black; border-radius: 10px" width="20"  height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="20" height="20" rx="10" fill="' +
                ship.cr +
                '"/></svg>';
              document.getElementById("ship-cat-img").innerHTML = shipCatSVG;
              document.getElementById("ship-category").innerHTML = ship.ct;
              document.getElementById("country").innerHTML =
                this.selectedpopupData.co;
              const country = this.selectedpopupData.co
                .replace(/[^a-zA-Z0-9]/g, "")
                .toLowerCase();
              document.getElementById("shipimg").innerHTML =
                '<img style="border: 1px solid black;" src="../../../assets/flags/' +
                country +
                '.svg" width="30px" alt="flag" />';
              document.getElementById("shipeta").innerHTML = formatDate(
                this.selectedpopupData.eta,
                "dd-MM-yyyy hh:mm:ss a",
                "en-US"
              );
              document.getElementById("destinationport").innerHTML =
                this.selectedpopupData.dt;
              this.selectedmmsi = ship.msi;
              this.soiflag = this.selectedpopupData.sf;
              this.goiflag = this.selectedpopupData.gf;
              if (
                this.selectedpopupData.cc === "Na" ||
                this.selectedpopupData.cc === "NA"
              ) {
                this.destination = "";
                document.getElementById("shipdestination").innerHTML = "";
              } else {
                this.destination = this.selectedpopupData.cc;
                const destCountry = this.selectedpopupData.cc
                  .replace(/[^a-zA-Z0-9]/g, "")
                  .toLowerCase();
                document.getElementById("shipdestination").innerHTML =
                  '<img style="border: 1px solid black;" src="../../../assets/flags/' +
                  destCountry +
                  '.svg" width="30px" alt="flag" />';
              }
              // amal
              // if (this.selectedpopupData.cc != 'Na' || this.selectedpopupData.cc != 'NA') {
              //   this.destination = this.selectedpopupData.cc;
              //   document.getElementById('shipdestination').innerHTML =
              // '<img style="border: 1px solid black;" src="../../../assets/flags/' +
              //     this.selectedpopupData.cc + '.svg" width="30px" alt="flag" />';
              // } else {
              //   this.destination = '';
              //   document.getElementById('shipdestination').innerHTML = '';
              // }
              if (ship.vfData === true) {
                document
                  .getElementById("vfTrack")
                  .setAttribute("style", "display: block");
                if (ship.todate === "" || ship.todate === null) {
                  if (ship.localtime !== this.localtime) {
                    document
                      .getElementById("pastTrack")
                      .setAttribute(
                        "style",
                        "pointer-events:none;color: grey;"
                      );
                  } else {
                    document
                      .getElementById("pastTrack")
                      .setAttribute("style", "color: white");
                  }
                } else if (ship.todate !== this.localtime) {
                  document
                    .getElementById("pastTrack")
                    .setAttribute("style", "pointer-events:none;color: grey;");
                } else {
                  document
                    .getElementById("pastTrack")
                    .setAttribute("style", "color: white");
                }
              }
              this.selectedpopupData.msi = ship.msi;
              this.selectedpopupData.cg = ship.cg;
              this.selectedpopupData.tm = ship.tm;
              document.getElementById("popup-table").innerHTML =
                "<tbody>\
              <tr class=tablecontent><td>IMO</td><td>" +
                this.selectedpopupData.imo +
                "</td></tr>\
              <tr class=tablecontent><td>COG </td><td>" +
                ship.cg +
                "&ordm; </td></tr>\
              <tr class=tablecontent><td>SOG </td><td>" +
                this.selectedpopupData.sg +
                " knots</td></tr>\
              <tr class=tablecontent><td>Latitude </td><td>" +
                ship.lt +
                "</td></tr>\
              <tr class=tablecontent><td>Longitude </td><td>" +
                ship.lg +
                "</td></tr>\
              <tr class=tablecontent><td>Length </td><td>" +
                this.selectedpopupData.ln +
                " metres</td></tr>\
              <tr class=tablecontent><td>Width  </td><td>" +
                this.selectedpopupData.wd +
                " metres </td></tr>\
              <tr class=tablecontent><td>Transceiver Class  </td><td>" +
                this.selectedpopupData.cls +
                "</td></tr>\
              <tr class=tablecontent><td>DTG</td><td>" +
                formatDate(
                  this.selectedpopupData.tm,
                  "dd-MM-yyyy hh:mm:ss a",
                  "en-US"
                ) +
                " </td></tr>\
              </tbody>";

              document.getElementById("pastTrack").removeAttribute("class");
              document.getElementById("pastRoute").removeAttribute("class");
              document
                .getElementById("showvfTrack")
                .setAttribute("class", "btn explain-btn showvfTrack");
              this.predictclass = false;
              this.predictdestination = false;
              // overlay.setPosition(coordinate);
              // amal
              overlay.setPosition([ship.lg, ship.lt]);
              const endDate = new Date();
              const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
              this.functionservice.successLogging(
                functionName + " success",
                seconds
              );
            }
          },
          (error) => {
            const endDate = new Date();
            const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
            this.functionservice.getErrorCond(error, functionName, seconds);
          }
        );
      } else {
        if (document.getElementById("popup")) {
          document
            .getElementById("popup")
            .setAttribute("style", "display:none");
        }
      }
    });

    this.shipsHover();
    // this.Dataservice.changeZoomLevel(parseFloat(this.map.getView().getZoom()).toFixed(2));
    this.Dataservice.changeZoomLevel(parseInt(this.map.getView().getZoom()));
    this.map.getView().on("change", () => {
      this.Dataservice.changeZoomLevel(parseInt(this.map.getView().getZoom()));
    });
  }

  // hover for ships
  shipsHover(): void {
    const shiphovercontainer = document.getElementById("shipshover");
    const shiphoveroverlay = new Overlay({
      element: shiphovercontainer,
      positioning: "center-center",
    });
    this.map.on("pointermove", (e) => {
      if (this.progressbar === false) {
        document.getElementById("map").setAttribute("style", "cursor: default");
      } else {
        document.getElementById("map").setAttribute("style", "cursor: wait");
      }
      const shipsDataonhover = e.map.forEachFeatureAtPixel(
        e.pixel,
        (feature): any => {
          return feature;
        },
        {
          layerFilter: (layer): any => {
            return (
              layer.get("name") === "ShipLayer" ||
              layer.get("name") === "SOILayer" ||
              layer.get("name") === "ROILayer" ||
              layer.get("name") === "VFLayer" ||
              layer.get("name") === "DMLayer"
            );
          },
        }
      );
      if (shipsDataonhover && shipsDataonhover.get("shipData") !== undefined) {
        const ships = shipsDataonhover.get("shipData");
        const time = formatDate(ships.tm, "dd-MM-yyyy,hh:mm a", "en-US");
        shiphovercontainer.setAttribute("style", "display:block");
        shiphovercontainer.innerHTML =
          '<p style="margin-bottom:0px"><b> ' +
          ships.sn +
          "( " +
          ships.msi +
          ' )</b></p><p style="margin-bottom:0px"><b> Coords: </b> ' +
          ships.lg +
          ", " +
          ships.lt +
          '</b></p> <p style="margin-bottom:0px">' +
          ships.ct +
          '</p><p style="margin-bottom:0px"> ' +
          time +
          "</p>";
        shiphoveroverlay.setOffset([0, 20]);
        shiphoveroverlay.setPositioning("bottom-right");
        shiphoveroverlay.setPosition(
          shipsDataonhover.getGeometry().getCoordinates()
        );
        const delta = this.getOverlayOffsets(this.map, shiphoveroverlay);
        if (delta[1] > 0) {
          shiphoveroverlay.setPositioning("bottom-center");
        }
        shiphoveroverlay.setOffset(delta);
        this.map.addOverlay(shiphoveroverlay);
        const iconFeature = [];
        iconFeature.push(
          new Feature({
            geometry: new Point([ships.lg, ships.lt]),
          })
        );

        this.map
          .getLayers()
          .getArray()
          .filter((layer) => layer.get("name") === "ShipHoverLayer")
          .forEach((layer) => {
            layer.getSource().clear();
            this.map.removeLayer(layer);
          });

        this.map.addLayer(
          new VectorLayer({
            source: new VectorSource({
              features: iconFeature,
            }),
            name: "ShipHoverLayer",
          })
        );
      } else {
        if (shiphovercontainer) {
          this.map
            .getLayers()
            .getArray()
            .filter((layer) => layer.get("name") === "ShipHoverLayer")
            .forEach((layer) => {
              layer.getSource().clear();
              this.map.removeLayer(layer);
            });
          shiphovercontainer.setAttribute("style", "display:none");
        }
      }
    });
  }

  // Soiplot
  plotSoIShips(data): void {
    if (data.length >= 1 && this.searchFlag === true) {
      this.seachAndplot();
    }
    this.ShipSource.clear();
    const shipFeatures = [];
    // Remove the WebGL Ship Layer before adding a New WebGL layer
    this.map
      .getLayers()
      .getArray()
      .filter(
        (layer) =>
          layer.get("name") === "SOILayer" ||
          layer.get("name") === "Seached Ship"
      )
      .forEach((layer) => {
        layer.getSource().clear();
        this.map.removeLayer(layer);
      });

    data.forEach((ship) => {
      shipFeatures.push(
        new Feature({
          geometry: new Point([ship.lg, ship.lt]),
          shipData: ship,
          category: ship.vessel_category,
          cog: ship.cg,
          mmsi: ship.msi,
          coo: ship.co,
          color: ship.color,
        })
      );
    });
    this.ShipSource.addFeatures(shipFeatures);

    this.map.addLayer(
      new WebGLPoints({
        source: this.ShipSource,
        style: this.shipstyle,
        name: "SOILayer",
      })
    );
    // if (data.length > 1) {
    //   this.map.getView().setCenter([data[0].lg, data[0].lt]);
    //   this.map.getView().setZoom(7);
    // }

    document
      .getElementById("disable-mapevent")
      .setAttribute("style", "cursor:default;");
    document
      .getElementById("overall")
      .setAttribute("style", "cursor: default;");
    this.progressbar = false;
  }

  // goiplot
  plotRoIShips(data): void {
    if (data.length >= 1 && this.searchFlag === true) {
      this.seachAndplot();
    }
    this.ShipSource.clear();
    const shipFeatures = [];
    // Remove the WebGL Ship Layer before adding a New WebGL layer
    this.map
      .getLayers()
      .getArray()
      .filter(
        (layer) =>
          layer.get("name") === "ROILayer" ||
          layer.get("name") === "Seached Ship"
      )
      .forEach((layer) => {
        layer.getSource().clear();
        this.map.removeLayer(layer);
      });
    data.forEach((ship) => {
      shipFeatures.push(
        new Feature({
          geometry: new Point([ship.lg, ship.lt]),
          shipData: ship,
          // category: ship.vessel_category,
          category: ship.ct,
          cog: ship.cg,
          mmsi: ship.msi,
          coo: ship.co,
          color: ship.color,
        })
      );
    });

    this.ShipSource.addFeatures(shipFeatures);
    this.map.addLayer(
      new WebGLPoints({
        source: this.ShipSource,
        style: this.shipstyle,
        name: "ROILayer",
      })
    );
    document
      .getElementById("disable-mapevent")
      .setAttribute("style", "cursor:default;");
    document
      .getElementById("overall")
      .setAttribute("style", "cursor: default;");
    this.progressbar = false;
  }

  seachAndplot(): void {
    const searchdata = {
      search_text: this.searchedRequestData.search_text,
      criteria: this.searchedRequestData.criteria,
      userid: this.userId,
      localtime: this.cookieService.get("localtime"),
    };

    const startDate = new Date();
    const functionName = "Get searched results details in main nav bar";
    this.functionservice.functionCallLogging(functionName);
    this.service.getSearchResult(searchdata).subscribe(
      (result) => {
        if (result.status === "success") {
          if (result.data.length === 0) {
            // console.log('NO DATA');
          } else {
            const iconFeature = [];
            result.data.forEach((mmsi) => {
              iconFeature.push(
                new Feature({
                  geometry: new Point([mmsi.lg, mmsi.lt]),
                })
              );
            });
            this.map.addLayer(
              new VectorLayer({
                source: new VectorSource({
                  features: iconFeature,
                }),
                name: "Seached Ship",
                zIndex: 50,
              })
            );
            if (result.data.length === 1) {
              this.map
                .getView()
                .setCenter([result.data[0].lg, result.data[0].lt]);
            }
            const gifUrl = "../../assets/ripple.gif";
            const gif = gifler(gifUrl);
            const that = this.map;
            gif.frames(
              document.createElement("canvas"),
              (ctx, frame): any => {
                iconFeature.forEach((mmsi) => {
                  if (!mmsi.getStyle()) {
                    mmsi.setStyle(
                      new Style({
                        image: new Icon({
                          img: ctx.canvas,
                          imgSize: [frame.width, frame.height],
                          opacity: 1,
                        }),
                      })
                    );
                  }
                });
                ctx.clearRect(0, 0, frame.width, frame.height);
                ctx.drawImage(frame.buffer, frame.x, frame.y);
                that.renderSync();
              },
              true
            );
          }

          // this.searchedresult = result.data;
          // this.searchedEvent.emit(this.searchedresult);
          const endDate = new Date();
          const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
          this.functionservice.successLogging(
            functionName + " success",
            seconds
          );
        }
      },
      (error) => {
        const endDate = new Date();
        const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
        this.functionservice.PostErrorCond(error, functionName, seconds);
      }
    );
  }

  // Plot ships
  plotShips(data): void {
    if (data.length >= 1 && this.searchFlag === true) {
      this.seachAndplot();
    }
    const shipFeatures = [];
    // Remove the WebGL Ship Layer before adding a New WebGL layer
    this.map
      .getLayers()
      .getArray()
      .filter(
        (layer) =>
          layer.get("name") === "ShipLayer" ||
          layer.get("name") === "Seached Ship"
      )
      .forEach((layer) => {
        layer.getSource().clear();
        this.map.removeLayer(layer);
      });
    data.forEach((ship) => {
      const cooLowerCase = ship.co.toLowerCase();
      ship.shipColor = this.shipsColors[cooLowerCase];
      if (ship.shipColor === undefined) {
        ship.shipColor = this.shipsColors.other;
      }
      shipFeatures.push(
        new Feature({
          geometry: new Point([ship.lg, ship.lt]),
          shipData: ship,
          category: ship.ct,
          cog: ship.cg,
          mmsi: ship.msi,
          coo: ship.co,
          shipColor: ship.shipColor,
        })
      );
    });
    this.ShipSource.clear();
    this.ShipSource.addFeatures(shipFeatures);
    this.map.addLayer(
      new WebGLPoints({
        source: this.ShipSource,
        style: this.shipstyle,
        name: "ShipLayer",
      })
    );
    document
      .getElementById("disable-mapevent")
      .setAttribute("style", "cursor:default;");
    document
      .getElementById("overall")
      .setAttribute("style", "cursor: default;");
    this.progressbar = false;
    if (document.getElementById("soi-top-pannel") !== null) {
      document
        .getElementById("soi-top-pannel")
        .setAttribute("style", "cursor:default;");
    }
  }

  // DMplot
  plotDMShips(data): void {
    this.ShipSource.clear();
    const shipFeatures = [];
    // Remove the WebGL Ship Layer before adding a New WebGL layer
    this.map
      .getLayers()
      .getArray()
      .filter((layer) => layer.get("name") === "DMLayer")
      .forEach((layer) => {
        layer.getSource().clear();
        this.map.removeLayer(layer);
      });

    data.forEach((ship) => {
      shipFeatures.push(
        new Feature({
          geometry: new Point([ship.lg, ship.lt]),
          shipData: ship,
          category: ship.vessel_category,
          cog: ship.cg,
          mmsi: ship.msi,
          coo: ship.co,
          color: ship.color,
        })
      );
    });
    this.ShipSource.addFeatures(shipFeatures);

    this.map.addLayer(
      new WebGLPoints({
        source: this.ShipSource,
        style: this.shipstyle,
        name: "DMLayer",
      })
    );

    document
      .getElementById("disable-mapevent")
      .setAttribute("style", "cursor:default;");
    document
      .getElementById("overall")
      .setAttribute("style", "cursor: default;");
    this.progressbar = false;
  }

  plotVFShips(data): void {
    this.ShipSource.clear();
    const shipFeatures = [];
    // Remove the WebGL Ship Layer before adding a New WebGL layer
    this.map
      .getLayers()
      .getArray()
      .filter((layer) => layer.get("name") === "VFLayer")
      .forEach((layer) => {
        layer.getSource().clear();
        this.map.removeLayer(layer);
      });

    data.forEach((ship) => {
      shipFeatures.push(
        new Feature({
          geometry: new Point([ship.lg, ship.lt]),
          shipData: ship,
          category: ship.ct,
          cog: ship.cg,
          mmsi: ship.msi,
          coo: ship.co,
          color: ship.color,
        })
      );
    });
    this.ShipSource.addFeatures(shipFeatures);

    this.map.addLayer(
      new WebGLPoints({
        source: this.ShipSource,
        style: this.shipstyle,
        name: "VFLayer",
      })
    );

    document
      .getElementById("disable-mapevent")
      .setAttribute("style", "cursor:default;");
    document
      .getElementById("overall")
      .setAttribute("style", "cursor: default;");
    this.progressbar = false;
  }

  // over lay position
  getOverlayOffsets(mapName, overlay): any {
    const overlayRect = overlay.getElement().getBoundingClientRect();
    const mapRect = mapName.getTargetElement().getBoundingClientRect();
    const margin = 15;
    const offsetLeft = overlayRect.left - mapRect.left - 75;
    const offsetRight = mapRect.right - overlayRect.right - 75;
    const offsetTop = overlayRect.top - mapRect.top - 75;
    const offsetBottom = mapRect.bottom - overlayRect.bottom - 75;
    const delta = [20, 20];
    if (offsetLeft < 0) {
      delta[0] = margin - offsetLeft;
    } else if (offsetRight < 0) {
      delta[0] = -(Math.abs(offsetRight) + margin);
    }
    if (offsetTop < 0) {
      delta[1] = margin - offsetTop;
    } else if (offsetBottom < 0) {
      delta[1] = -(Math.abs(offsetBottom) + margin);
    }
    return delta;
  }

  // Hover on trajectory
  trajectoryOver(): void {
    const trajhovercontainer = document.getElementById("trajhover");
    const trajoverlay = new Overlay({
      element: trajhovercontainer,
      positioning: "center-center",
    });
    this.map.on("pointermove", (e) => {
      const trajhoverData = e.map.forEachFeatureAtPixel(
        e.pixel,
        (feature): any => {
          return feature;
        }
      );
      if (trajhoverData && trajhoverData.get("trajectoryData") !== undefined) {
        const traj = trajhoverData.get("trajectoryData");
        trajhovercontainer.setAttribute("style", "display:block");
        trajhovercontainer.innerHTML =
          "<p style=margin-bottom:0px;><b>MMSI: </b>" +
          traj.msi +
          "</p>\
                                        <p style=margin-bottom:0px;><b>Trajectory ID: </b>" +
          traj.id +
          "</p>";
        trajoverlay.setOffset([0, 0]);
        trajoverlay.setPositioning("bottom-right");
        trajoverlay.setPosition(e.coordinate);
        const delta = this.getOverlayOffsets(this.map, trajoverlay);
        if (delta[1] > 0) {
          trajoverlay.setPositioning("bottom-center");
        }
        trajoverlay.setOffset(delta);
        this.map.addOverlay(trajoverlay);
      } else if (
        trajhoverData &&
        trajhoverData.get("shiptypeanmolyData") !== undefined
      ) {
        const anomaly = trajhoverData.get("shiptypeanmolyData");
        const time = formatDate(anomaly.tm, "dd-MM-yyyy,hh:mm a", "en-US");
        trajhovercontainer.setAttribute("style", "display:block");
        trajhovercontainer.innerHTML =
          "<span>Changed from " +
          anomaly.pt +
          " to " +
          anomaly.ct +
          "</span><br/>\
                                        <span>" +
          time +
          "</span>";
        trajoverlay.setOffset([0, 0]);
        trajoverlay.setPositioning("bottom-right");
        trajoverlay.setPosition(e.coordinate);
        const delta = this.getOverlayOffsets(this.map, trajoverlay);
        if (delta[1] > 0) {
          trajoverlay.setPositioning("bottom-center");
        }
        trajoverlay.setOffset(delta);
        this.map.addOverlay(trajoverlay);
      } else if (
        trajhoverData &&
        trajhoverData.get("anchorageAnomalyData") !== undefined
      ) {
        const anomaly = trajhoverData.get("anchorageAnomalyData");
        const time = formatDate(anomaly.tm, "dd-MM-yyyy,hh:mm a", "en-US");
        trajhovercontainer.setAttribute("style", "display:block");
        trajhovercontainer.innerHTML =
          "<span> Unknown Anchorage </span> <br>\
                                        <span>" +
          time +
          "</span>";
        trajoverlay.setOffset([0, 0]);
        trajoverlay.setPositioning("bottom-right");
        trajoverlay.setPosition(e.coordinate);
        const delta = this.getOverlayOffsets(this.map, trajoverlay);
        if (delta[1] > 0) {
          trajoverlay.setPositioning("bottom-center");
        }
        trajoverlay.setOffset(delta);
        this.map.addOverlay(trajoverlay);
      } else if (
        trajhoverData &&
        trajhoverData.get("RoutePredictedData") !== undefined
      ) {
        const predicted = trajhoverData.get("RoutePredictedData");
        const time = formatDate(predicted.tm, "dd-MM-yyyy,hh:mm a", "en-US");
        trajhovercontainer.setAttribute("style", "display:block");
        trajhovercontainer.innerHTML =
          "<span>" +
          predicted.mmsi +
          " </span> <br>\
                                        <span>" +
          predicted.tm +
          "</span>";
        trajoverlay.setOffset([0, 0]);
        trajoverlay.setPositioning("bottom-right");
        trajoverlay.setPosition(e.coordinate);
        const delta = this.getOverlayOffsets(this.map, trajoverlay);
        if (delta[1] > 0) {
          trajoverlay.setPositioning("bottom-center");
        }
        trajoverlay.setOffset(delta);
        this.map.addOverlay(trajoverlay);
      } else if (
        trajhoverData &&
        trajhoverData.get("PastTrackData") !== undefined
      ) {
        const past = trajhoverData.get("PastTrackData");
        trajhovercontainer.setAttribute("style", "display:block");
        trajhovercontainer.innerHTML =
          "<span>MMSI: " +
          past.mmsi +
          " </span> <br>\
                                        <span>Traj ID: " +
          past.id +
          "</span>";
        trajoverlay.setOffset([0, 0]);
        trajoverlay.setPositioning("bottom-right");
        trajoverlay.setPosition(e.coordinate);
        const delta = this.getOverlayOffsets(this.map, trajoverlay);
        if (delta[1] > 0) {
          trajoverlay.setPositioning("bottom-center");
        }
        trajoverlay.setOffset(delta);
        this.map.addOverlay(trajoverlay);
      } else if (
        trajhoverData &&
        trajhoverData.get("DestinationPredictedData") !== undefined
      ) {
        const port = trajhoverData.get("DestinationPredictedData");
        trajhovercontainer.setAttribute("style", "display:block");
        trajhovercontainer.innerHTML =
          "<span>Port name: " + port.destination + " </span>";
        trajoverlay.setOffset([0, 0]);
        trajoverlay.setPositioning("bottom-right");
        trajoverlay.setPosition(e.coordinate);
        const delta = this.getOverlayOffsets(this.map, trajoverlay);
        if (delta[1] > 0) {
          trajoverlay.setPositioning("bottom-center");
        }
        trajoverlay.setOffset(delta);
        this.map.addOverlay(trajoverlay);
      } else {
        if (trajhovercontainer) {
          trajhovercontainer.setAttribute("style", "display:none");
        }
      }
    });
  }

  // show Graticule on map
  showGraticule(): void {
    if (this.graticule === false) {
      this.graticule = true;
      this.map.addLayer(
        new Graticule({
          strokeStyle: new Stroke({
            color: "rgba(255,120,0,0.9)",
            width: 2,
            lineDash: [0.5, 4],
          }),
          showLabels: true,
          wrapX: true,
          name: "Graticule",
        })
      );
    } else {
      this.graticule = false;
      this.map
        .getLayers()
        .getArray()
        .filter((layer) => layer.get("name") === "Graticule")
        .forEach((layer) => this.map.removeLayer(layer));
    }
  }

  // Changing map type
  changeMapType(mapType): void {
    const startDate = new Date();
    const functionName = "Update mao type in ship map";
    this.functionservice.functionCallLogging(functionName);
    const updatingdata = { userid: this.userId, map: mapType };
    this.service.updateMapType(updatingdata).subscribe(
      (data) => {
        if (data.status === "success") {
          this.cookieService.set("map", data.data);
          this.maptype = data.data;
          const map = [
            { mapname: "Standard Map", layername: "osm" },
            { mapname: "Satellite Map", layername: "simple_dark" },
            { mapname: "Nautical Map", layername: "ENC" },
          ];
          map.forEach((maptype) => {
            this.map
              .getLayers()
              .getArray()
              .forEach((layer) => {
                if (layer.get("name") === maptype.mapname) {
                  if (layer.get("name") === this.maptype) {
                    layer.setVisible(true);
                  } else {
                    layer.setVisible(false);
                  }
                }
              });
          });
          // amal
          // const sliderElem = (<HTMLInputElement> document.getElementById('range_bgMapOpacity'));
          // sliderElem.value = '1';
          // this.fnChangeMapOpacity(sliderElem);

          this.opacitySildervalue = parseFloat("1");
          this.fnChangeMapOpacity(this.opacitySildervalue);
          const endDate = new Date();
          const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
          this.functionservice.successLogging(
            functionName + " success",
            seconds
          );
        }
      },
      (error) => {
        const endDate = new Date();
        const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
        this.functionservice.PostErrorCond(error, functionName, seconds);
      }
    );
  }

  // Zooming In map
  zoomIn(): void {
    this.map.getView().setZoom(this.map.getView().getZoom() + 1);
    this.Dataservice.changeZoomLevel(parseInt(this.map.getView().getZoom()));
  }

  // Zooimg Out map
  zoomOut(): void {
    this.map.getView().setZoom(this.map.getView().getZoom() - 1);
    this.Dataservice.changeZoomLevel(parseInt(this.map.getView().getZoom()));
  }

  fnChangeMapOpacity(val): void {
    // const opacity = typeof(e.target) === 'undefined' ? parseFloat(e.value) : parseFloat(e.target.value);
    this.opacitySildervalue = parseFloat(val);
    this.map
      .getLayers()
      .getArray()
      .forEach((layer) => {
        if (
          layer.getVisible() &&
          (layer.get("name") === "Standard Map" ||
            layer.get("name") === "Satellite Map" ||
            layer.get("name") === "Nautical Map")
        ) {
          layer.setOpacity(this.opacitySildervalue);
        }
      });
  }

  ngOnDestroy(): void {
    if (this.plottimerfunction) {
      clearInterval(this.plottimerfunction);
    }
    this.Dataservice.changeNavbarInROI(false);
    this.Dataservice.changeNavbarInVF(false);
  }

  // View fullscreen
  fullscreen(): void {
    const elem = document.getElementById("map");
    elem.requestFullscreen();
  }

  // known Anchors
  getKnownAnchors(e): void {
    const startDate = new Date();
    const functionName = "Get known anchors in ship map";
    this.functionservice.functionCallLogging(functionName);
    if (e.target.checked) {
      this.progressbar = true;
      document.getElementById("overall").setAttribute("style", "cursor: wait;");
      this.checkedknownanchors = true;
      this.checkedanchors = true;
      this.service.getKnownAnchors(this.userId).subscribe(
        (result) => {
          if (result.status === "success") {
            this.knownanchors = result.data;
            this.plotKnownAnchors();
            const endDate = new Date();
            const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
            this.functionservice.successLogging(
              functionName + " success",
              seconds
            );
          }
        },
        (error) => {
          const endDate = new Date();
          const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
          this.functionservice.getErrorCond(error, functionName, seconds);
        }
      );
      this.progressbar = false;
      document
        .getElementById("overall")
        .setAttribute("style", "cursor: default;");
    } else {
      this.knownanchors = [];
      this.KnownAnchorsSource.clear();
      this.plotKnownAnchors();
      this.checkedknownanchors = false;
      if (this.checkedpredictanchors === false) {
        this.checkedanchors = false;
      }
    }
  }

  // Plot known anchors data
  plotKnownAnchors(): void {
    const knownanchorsfeature = [];
    this.knownanchors.forEach((knownanchor) => {
      knownanchorsfeature.push(
        new Feature({
          geometry: new Point([knownanchor.long, knownanchor.lat]),
          knownanchorsData: knownanchor,
        })
      );
    });
    this.KnownAnchorsSource.addFeatures(knownanchorsfeature);
    const anchorStyle = {
      symbol: {
        symbolType: "image",
        src: "../../assets/map/anchor_yellow.svg",
        size: 10,
        color: "YELLOW",
        rotateWithView: true,
        offset: [0, 0],
        opacity: 0.8,
      },
    };
    this.map.addLayer(
      new WebGLPoints({
        source: this.KnownAnchorsSource,
        name: "Known Anchors Layers",
        style: anchorStyle,
      })
    );
    const knownanchorshovercontainer =
      document.getElementById("knownanchorshover");
    const knownanchorsoverlay = new Overlay({
      element: knownanchorshovercontainer,
      positioning: "center-center",
    });
    this.map.on("pointermove", (e) => {
      if (this.progressbar === false) {
        document.getElementById("map").setAttribute("style", "cursor: default");
      } else {
        document.getElementById("map").setAttribute("style", "cursor: wait");
      }
      const knownanchorsDataonhover = e.map.forEachFeatureAtPixel(
        e.pixel,
        (feature): any => {
          return feature;
        }
      );
      if (
        knownanchorsDataonhover &&
        knownanchorsDataonhover.get("knownanchorsData") !== undefined
      ) {
        const knownanchors = knownanchorsDataonhover.get("knownanchorsData");
        knownanchorshovercontainer.setAttribute("style", "display:block");
        knownanchorshovercontainer.innerHTML =
          "<p style=margin-bottom:0px;><b>Anchor ID: </b>" +
          knownanchors.anchorid +
          "</p> \
                                                  <p style=margin-bottom:0px;><b>Anchor Name: </b>" +
          knownanchors.label +
          "</p> \
                                                  <p style=margin-bottom:0px;><b>Anchor Source: </b>" +
          knownanchors.anchor_source +
          "</p>\
                                                  <p style=margin-bottom:0px;><b>Country: </b>" +
          knownanchors.country_code +
          "</p>\
                                                  <p style=margin-bottom:0px;><b>Distance from shore: </b>" +
          knownanchors.distance_from_shore +
          "</p>\
                                                  <p style=margin-bottom:0px;><b>Drift radius: </b>" +
          knownanchors.drift_radius +
          "</p>\
                                                  <p style=margin-bottom:0px;><b>Latitude: </b>" +
          knownanchors.lat +
          "</p>\
                                                  <p style=margin-bottom:0px;><b>Longitude: </b>" +
          knownanchors.long +
          "</p>";
        knownanchorsoverlay.setOffset([0, 0]);
        knownanchorsoverlay.setPositioning("bottom-right");
        knownanchorsoverlay.setPosition(
          knownanchorsDataonhover.getGeometry().getCoordinates()
        );
        const delta = this.getOverlayOffsets(this.map, knownanchorsoverlay);
        if (delta[1] > 0) {
          knownanchorsoverlay.setPositioning("bottom-center");
        }
        knownanchorsoverlay.setOffset(delta);
        this.map.addOverlay(knownanchorsoverlay);
      } else {
        if (knownanchorshovercontainer) {
          knownanchorshovercontainer.setAttribute("style", "display:none");
        }
      }
    });
  }

  // Predicted Anchors
  getPredictedAnchors(e): void {
    const startDate = new Date();
    const functionName = "Get predicted anchors in ship map";
    this.functionservice.functionCallLogging(functionName);
    if (e.target.checked) {
      this.progressbar = true;
      // document.getElementById('disable-mapevent').setAttribute('style','cursor:progress;pointer-events:none');
      document.getElementById("overall").setAttribute("style", "cursor: wait;");
      this.checkedpredictanchors = true;
      this.checkedanchors = true;
      this.service.getPredictedAnchors(this.userId).subscribe(
        (result) => {
          if (result.status === "success") {
            this.predictedanchors = result.data;
            this.plotPredictedAnchors();
            const endDate = new Date();
            const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
            this.functionservice.successLogging(
              functionName + " success",
              seconds
            );
          }
        },
        (error) => {
          const endDate = new Date();
          const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
          this.functionservice.getErrorCond(error, functionName, seconds);
        }
      );
      this.progressbar = false;
      document
        .getElementById("overall")
        .setAttribute("style", "cursor: default;");
    } else {
      this.predictedanchors = [];
      this.PredictedAnchorsSource.clear();
      this.plotPredictedAnchors();
      this.checkedpredictanchors = false;
      if (this.checkedknownanchors === false) {
        this.checkedanchors = false;
      }
    }
  }

  // plot predict anchors
  plotPredictedAnchors(): void {
    const predictedanchorsfeature = [];
    this.predictedanchors.forEach((PredAnchors, i) => {
      const predictedanchorsData = PredAnchors;
      const polygoncoordinates = [];
      predictedanchorsData.points.forEach((points) => {
        polygoncoordinates.push([points.lg, points.lt]);
      });
      predictedanchorsfeature.push(
        new Feature({
          geometry: new Polygon([polygoncoordinates]),
          predictedanchorsData: PredAnchors,
        })
      );
      if (PredAnchors.std === true) {
        PredAnchors.anchortype = "Standard";
        PredAnchors.color = "orange";
      } else {
        PredAnchors.anchortype = "Non-standard";
        PredAnchors.color = "red";
      }
      predictedanchorsfeature[i].setStyle(
        new Style({
          stroke: new Stroke({
            color: PredAnchors.color,
            width: 2,
          }),
          fill: new Fill({
            color: "rgba(255,255,255,0.75)",
          }),
        })
      );
    });
    this.PredictedAnchorsSource.addFeatures(predictedanchorsfeature);
    this.map.addLayer(
      new VectorLayer({
        source: this.PredictedAnchorsSource,
        name: "Predicted Anchors Layers",
      })
    );
    const predanchorshovercontainer =
      document.getElementById("predanchorshover");
    const predanchorsoverlay = new Overlay({
      element: predanchorshovercontainer,
      positioning: "center-center",
    });
    this.map.on("pointermove", (e) => {
      if (this.progressbar === false) {
        document.getElementById("map").setAttribute("style", "cursor: default");
      } else {
        document.getElementById("map").setAttribute("style", "cursor: wait");
      }
      const predanchorsDataonhover = e.map.forEachFeatureAtPixel(
        e.pixel,
        (feature): any => {
          return feature;
        }
      );
      if (
        predanchorsDataonhover &&
        predanchorsDataonhover.get("predictedanchorsData") !== undefined
      ) {
        const predanchors = predanchorsDataonhover.get("predictedanchorsData");
        predanchorshovercontainer.setAttribute("style", "display:block");
        predanchorshovercontainer.innerHTML =
          "<p style=margin-bottom:0px;><b>Anchor ID: </b>" +
          predanchors.anchorid +
          "</p>\
                                                <p style=margin-bottom:0px;><b>Anchor Type: </b>" +
          predanchors.anchortype +
          "</p>";
        predanchorsoverlay.setOffset([0, 0]);
        predanchorsoverlay.setPositioning("bottom-right");
        predanchorsoverlay.setPosition(e.coordinate);
        const delta = this.getOverlayOffsets(this.map, predanchorsoverlay);
        if (delta[1] > 0) {
          predanchorsoverlay.setPositioning("bottom-center");
        }
        predanchorsoverlay.setOffset(delta);
        this.map.addOverlay(predanchorsoverlay);
      } else {
        if (predanchorshovercontainer) {
          predanchorshovercontainer.setAttribute("style", "display:none");
        }
      }
    });
  }

  // Ports
  getPorts(e): void {
    const startDate = new Date();
    const functionName = "Get ports in ship map";
    this.functionservice.functionCallLogging(functionName);
    if (e.target.checked) {
      this.progressbar = true;
      document.getElementById("overall").setAttribute("style", "cursor: wait;");
      this.checkedports = true;
      this.service.getPorts(this.userId).subscribe(
        (result) => {
          if (result.status === "success") {
            this.ports = result.data;
            this.plotPorts();
            const endDate = new Date();
            const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
            this.functionservice.successLogging(
              functionName + " success",
              seconds
            );
          }
        },
        (error) => {
          const endDate = new Date();
          const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
          this.functionservice.getErrorCond(error, functionName, seconds);
        }
      );
      this.progressbar = false;
      document
        .getElementById("overall")
        .setAttribute("style", "cursor: default;");
    } else {
      this.ports = [];
      this.PortsSource.clear();
      this.plotPorts();
      this.checkedports = false;
    }
  }

  // plot ports
  plotPorts(): void {
    const portsfeature = [];
    this.ports.forEach((port) => {
      portsfeature.push(
        new Feature({
          geometry: new Point([port.long, port.lat]),
          portsData: port,
        })
      );
    });

    this.PortsSource.addFeatures(portsfeature);
    const portStyle = {
      symbol: {
        symbolType: "image",
        src: "../../assets/map/Ports_orange.svg",
        size: 15,
        color: "YELLOW",
        rotateWithView: true,
        offset: [0, 0],
        opacity: 0.8,
      },
    };
    this.map.addLayer(
      new WebGLPoints({
        source: this.PortsSource,
        name: "Ports Layers",
        style: portStyle,
      })
    );
    const portshovercontainer = document.getElementById("portshover");
    const portsoverlay = new Overlay({
      element: portshovercontainer,
      positioning: "center-center",
    });
    this.map.on("pointermove", (e) => {
      if (this.progressbar === false) {
        document.getElementById("map").setAttribute("style", "cursor: default");
      } else {
        document.getElementById("map").setAttribute("style", "cursor: wait");
      }
      const portsDataonhover = e.map.forEachFeatureAtPixel(
        e.pixel,
        (feature): any => {
          return feature;
        }
      );
      if (portsDataonhover && portsDataonhover.get("portsData") !== undefined) {
        const ports = portsDataonhover.get("portsData");
        portshovercontainer.setAttribute("style", "display:block");
        portshovercontainer.innerHTML =
          "<p style=margin-bottom:0px;> <b>Port ID: </b>" +
          ports.port_id +
          "</p> \
                                           <p style=margin-bottom:0px;> <b>Port name: </b>" +
          ports.port_name +
          "</p> \
                                           <p style=margin-bottom:0px;> <b>Country: </b>" +
          ports.country_code +
          "</p>\
                                           <p style=margin-bottom:0px;> <b>Latitude: </b>" +
          ports.lat +
          "</p>\
                                           <p style=margin-bottom:0px;> <b>Longitude: </b>" +
          ports.long +
          "</p>";
        portsoverlay.setOffset([0, 0]);
        portsoverlay.setPositioning("bottom-right");
        portsoverlay.setPosition(
          portsDataonhover.getGeometry().getCoordinates()
        );
        const delta = this.getOverlayOffsets(this.map, portsoverlay);
        if (delta[1] > 0) {
          portsoverlay.setPositioning("bottom-center");
        }
        portsoverlay.setOffset(delta);
        this.map.addOverlay(portsoverlay);
      } else {
        if (portshovercontainer) {
          portshovercontainer.setAttribute("style", "display:none");
        }
      }
    });
  }

  // open add to soi and goi on click on fav icon
  addfav(): void {
    this.isFav = !this.isFav;
    this.togroup = false;
  }
  // Ship of interest
  // Add SOI in popup
  addSoI(): void {
    const startDate = new Date();
    const functionName = "Add to soi in ship map";
    this.functionservice.functionCallLogging(functionName);
    const addSOIData = {
      mmsi: this.selectedmmsi,
      userid: this.userId,
    };
    this.service.addSoI(addSOIData).subscribe(
      (data) => {
        if (data.status === "success") {
          this.toastr.success(data.data, "", {
            timeOut: 3000,
          });
          // this.computationMessage = 'Track computation is under process.It may take upto 10mins.';
          // document.getElementById('opensoiroicomputation').click();
          this.soiflag = 1;
          this.isFav = false;
          this.Dataservice.SOIupdate("update soi details");
          const endDate = new Date();
          const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
          this.functionservice.successLogging(
            functionName + " success",
            seconds
          );
        }
      },
      (error) => {
        const endDate = new Date();
        const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
        this.functionservice.PostErrorCond(error, functionName, seconds);
      }
    );
  }

  // open delete soi model
  openDeleteSoiModel(s): void {
    document.getElementById("opensoideleteModel").click();
    this.deletingSoiShipName = s.name;
    this.deletingsoiship = s.mmsi;
  }

  // Delete soi
  deleteSoI(): void {
    const startDate = new Date();
    const functionName = "Delete SoI in ship map";
    this.functionservice.functionCallLogging(functionName);
    this.loginStatus = this.cookieService.get("loginStatus");
    if (this.loginStatus === "true") {
      const deleteData = { userid: this.userId, mmsi: this.deletingsoiship };
      this.service.deleteSoI(deleteData).subscribe(
        (data) => {
          if (data.status === "success") {
            this.toastr.success(
              "Deleted " +
                this.deletingSoiShipName +
                " (" +
                this.deletingsoiship +
                ") from ships of interest ",
              "",
              {
                timeOut: 3000,
              }
            );
            this.Dataservice.SOIupdate("update soi track details");
            // this.Dataservice.SOIupdate('update soi details');
            document.getElementById("closedeletesoimodel").click();
            const endDate = new Date();
            const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
            this.functionservice.successLogging(
              functionName + " success",
              seconds
            );
          }
        },

        (error) => {
          const endDate = new Date();
          const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
          this.functionservice.PostErrorCond(error, functionName, seconds);
        }
      );
    }
  }
  // end ship of interest

  // group of interest

  // Add goi in popup
  addGoI(): void {
    const startDate = new Date();
    const functionName = "Add GoI in ship map";
    this.functionservice.functionCallLogging(functionName);
    this.goisubmitted = true;
    if (this.goiFrom.invalid) {
      return;
    }
    if (this.goiFrom.value.group_name.trim() === "") {
      this.goiFrom.controls.group_name.setErrors({ empty: true });
      return;
    }
    this.goiFrom.setValue({
      userid: this.userId,
      mmsi: this.selectedmmsi,
      group_name: this.goiFrom.value.group_name,
      flag: 0,
    });
    this.service.addGoI(this.goiFrom.value).subscribe(
      (data) => {
        if (data.status === "success") {
          this.toastr.success(
            "Successfully added " +
              this.selectedmmsi +
              " to new group " +
              this.goiFrom.value.group_name,
            "",
            {
              timeOut: 3000,
            }
          );
          this.Dataservice.GOIupdate("update goi details");
          this.goiflag = 1;
          document.getElementById("closegoiModel").click();
          this.goisubmitted = false;
          this.goiFrom.setValue({
            userid: this.userId,
            mmsi: "",
            group_name: "",
            flag: "",
          });
          this.isFav = false;
          const endDate = new Date();
          const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
          this.functionservice.successLogging(
            functionName + " success",
            seconds
          );
        }
      },
      (error) => {
        const endDate = new Date();
        const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
        if (error.status === "failure") {
          this.goiFrom.controls.group_name.setErrors({ duplicate: true });
          this.functionservice.errorLogging(
            functionName,
            error.message,
            seconds
          );
        } else {
          this.functionservice.PostErrorCond(error, functionName, seconds);
        }
      }
    );
  }

  // close add goi model
  closeGoiModel(): void {
    this.isFav = false;
    this.goisubmitted = false;
    this.goiFrom.setValue({
      userid: this.userId,
      mmsi: "",
      group_name: "",
      flag: "",
    });
  }

  // Add mmsi to existing group in popup
  addMMSIToExistingGOI(g, v): void {
    const startDate = new Date();
    const functionName = "Add ship to existing GoI in ship map";
    this.functionservice.functionCallLogging(functionName);
    const newgoidata = {
      userid: this.userId,
      mmsi: this.selectedmmsi,
      group_name: g.Group_ID,
      flag: 1,
    };
    this.service.addGoI(newgoidata).subscribe(
      (data) => {
        if (data.status === "success") {
          this.toastr.success(
            "Successfully added " + this.selectedmmsi + " to " + g.Group_ID,
            "",
            {
              timeOut: 3000,
            }
          );
          this.Dataservice.GOIupdate("update goi details");
          this.getGoiShipsOnPopup();
          this.goiflag = 1;
          this.isFav = false;
          const endDate = new Date();
          const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
          this.functionservice.successLogging(
            functionName + " success",
            seconds
          );
        }
      },

      (error) => {
        const endDate = new Date();
        const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
        this.functionservice.PostErrorCond(error, functionName, seconds);
      }
    );
  }

  // Add goi without mmsi in soi page
  addGoIWithoutMMSI(): void {
    const startDate = new Date();
    const functionName = "Add new GOI without ship in ship map";
    this.functionservice.functionCallLogging(functionName);
    this.goisubmitted = true;
    if (this.goiFrom.invalid) {
      return;
    }
    if (this.goiFrom.value.group_name.trim() === "") {
      this.goiFrom.controls.group_name.setErrors({ empty: true });
      return;
    }
    const reqData = {
      userid: this.userId,
      group_name: this.goiFrom.value.group_name,
      mmsi: [],
      flag: 0,
    };
    this.service.addGroupWithoutMMSI(reqData).subscribe(
      (data) => {
        if (data.status === "success") {
          this.toastr.success(
            "Successfully added new group " + this.goiFrom.value.group_name,
            "",
            {
              timeOut: 3000,
            }
          );
          this.Dataservice.GOIupdate("update goi details");
          document.getElementById("closegoinewModel").click();
          this.goisubmitted = false;
          this.goiFrom.setValue({
            userid: this.userId,
            mmsi: "",
            group_name: "",
            flag: "",
          });
          const endDate = new Date();
          const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
          this.functionservice.successLogging(
            functionName + " success",
            seconds
          );
        }
      },

      (error) => {
        const endDate = new Date();
        const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
        if (error.status === "failure") {
          this.goiFrom.controls.group_name.setErrors({ duplicate: true });
          this.functionservice.errorLogging(
            functionName,
            error.message,
            seconds
          );
        } else {
          this.functionservice.PostErrorCond(error, functionName, seconds);
        }
      }
    );
  }

  // Delete mmsi in goi model
  openDeleteMMSIOfGoIModel(g, m): void {
    document.getElementById("openmmsiofgoideleteModel").click();
    this.deletingmmsiofgoiship = g;
    this.deletingmmsiofgoi = m;
  }

  // Delete mmsi in goi
  deleteMMSIOfGoI(): void {
    const startDate = new Date();
    const functionName = "Delete ship from GoI in ship map";
    this.functionservice.functionCallLogging(functionName);
    const goidata = {
      group_name: this.deletingmmsiofgoiship,
      userid: this.userId,
      mmsi: this.deletingmmsiofgoi,
    };
    this.service.deleteGoI(goidata).subscribe(
      (result) => {
        if (result.status === "success") {
          this.toastr.success(
            "Deleted " +
              this.deletingmmsiofgoi +
              " from ship group " +
              this.deletingmmsiofgoiship,
            "",
            {
              timeOut: 3000,
            }
          );
          document.getElementById("closedeletemmsiofgoimodel").click();
          this.Dataservice.GOIupdate("update goi track details for mmsi");
          this.Dataservice.GOIupdate("update goi details");
          const endDate = new Date();
          const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
          this.functionservice.successLogging(
            functionName + " success",
            seconds
          );
        }
      },

      (error) => {
        const endDate = new Date();
        const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
        this.functionservice.PostErrorCond(error, functionName, seconds);
      }
    );
  }

  // delete goi model
  openDeleteGoIModel(g): void {
    document.getElementById("opengoideleteModel").click();
    this.deletinggoiship = g.Group_ID;
  }

  // delete goi
  deleteGoI(): void {
    const startDate = new Date();
    const functionName = "Delete GoI in ship map";
    this.functionservice.functionCallLogging(functionName);
    const goidata = {
      group_name: this.deletinggoiship,
      userid: this.userId,
      mmsi: "",
    };
    this.service.deleteGoI(goidata).subscribe(
      (result) => {
        if (result.status === "success") {
          this.toastr.success(
            "Deleted " + this.deletinggoiship + " from ship groups",
            "",
            {
              timeOut: 3000,
            }
          );
          document.getElementById("closedeletegoimodel").click();
          this.Dataservice.GOIupdate("update goi track details");
          this.Dataservice.GOIupdate("update goi details");
          const endDate = new Date();
          const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
          this.functionservice.successLogging(
            functionName + " success",
            seconds
          );
        }
      },

      (error) => {
        const endDate = new Date();
        const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
        this.functionservice.PostErrorCond(error, functionName, seconds);
      }
    );
  }

  // get groups in popup
  getGoiShipsOnPopup(): void {
    const startDate = new Date();
    const functionName = "Get GoI for user to display on popup in ship map";
    this.functionservice.functionCallLogging(functionName);
    this.togroup = !this.togroup;
    const shipnameclass = document
      .getElementById("ship-group")
      .getAttribute("class");
    if (shipnameclass === "active_text activebg") {
      document.getElementById("ship-group").setAttribute("class", "");
    } else {
      document
        .getElementById("ship-group")
        .setAttribute("class", "active_text activebg");
    }
    this.service.getGoIDetailsForUser(this.userId).subscribe(
      (result) => {
        this.goiforpopup = result.data;
        this.goiforpopuplength = this.goiforpopup.length;
        this.goiforpopup.forEach((g) => {
          g.img = "add";
          g.disable = "false";
          g.group_details.forEach((details) => {
            if (details.mmsi === this.selectedmmsi) {
              g.img = "tick";
              g.disable = "true";
            }
          });
        });
      },
      (error) => {
        const endDate = new Date();
        const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
        this.functionservice.PostErrorCond(error, functionName, seconds);
      }
    );
  }

  // edit goi model
  openEditGoI(g): void {
    document.getElementById("openEditGOIModel").click();
    this.editinggroupname = g;
  }

  // close edit goi
  closeEditGoIModel(): void {
    this.editgoisubmitted = false;
    this.editgoiForm.setValue({
      userid: this.userId,
      old_goi: "",
      new_goi: "",
    });
  }

  // edit group name
  editGroupName(): void {
    const startDate = new Date();
    const functionName = "Edit GoI name in ship map";
    this.functionservice.functionCallLogging(functionName);
    this.editgoisubmitted = true;
    if (this.editgoiForm.invalid) {
      return;
    }
    if (this.editgoiForm.value.new_goi.trim() === "") {
      this.editgoiForm.controls.new_goi.setErrors({ empty: true });
      return;
    }
    this.editgoiForm.setValue({
      userid: this.userId,
      old_goi: this.editinggroupname,
      new_goi: this.editgoiForm.value.new_goi,
    });
    if (this.editinggroupname === this.editgoiForm.value.new_goi) {
      this.editgoiForm.controls.new_goi.setErrors({ samename: true });
      return;
    }
    if (this.loginStatus === "true") {
      this.service.editGoI(this.editgoiForm.value).subscribe(
        (data) => {
          if (data.status === "success") {
            this.toastr.success(
              "Updated group name " +
                this.editinggroupname +
                " to " +
                this.editgoiForm.value.new_goi,
              "",
              {
                timeOut: 3000,
              }
            );
            this.editgoisubmitted = false;
            document.getElementById("closeeditgoiModel").click();
            this.editgoiForm.setValue({
              userid: this.userId,
              old_goi: "",
              new_goi: "",
            });
            this.Dataservice.GOIupdate("update goi details");
            const endDate = new Date();
            const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
            this.functionservice.successLogging(
              functionName + " success",
              seconds
            );
          }
        },
        (error) => {
          const endDate = new Date();
          const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
          if (error.status === "failure") {
            this.editgoiForm.controls.new_goi.setErrors({ duplicate: true });
            this.functionservice.errorLogging(
              functionName,
              error.message,
              seconds
            );
          } else {
            this.functionservice.PostErrorCond(error, functionName, seconds);
          }
        }
      );
    }
  }
  // Region of interest

  // Add interaction to mark area on map
  addInteraction(): void {
    clearInterval(this.plottimerfunction);
    let value = "Box";
    if (value !== "None") {
      let geometryfunctions = "";
      if (value === "Square") {
        value = "Circle";
        geometryfunctions = createRegularPolygon(4);
      } else if (value === "Box") {
        value = "Circle";
        geometryfunctions = createBox();
      }

      this.draw = new Draw({
        type: value,
        geometryFunction: geometryfunctions,
      });
      this.map.addInteraction(this.draw);

      this.draw.on("drawend", (evt): void => {
        const feature = evt.feature;
        const ROIcoords = feature.getGeometry().getCoordinates();
        document.getElementById("openAddROIModel").click();
        document.getElementById("topLeft").innerHTML =
          ROIcoords[0][3][0] + "<br/>" + ROIcoords[0][3][1];
        document.getElementById("topRight").innerHTML =
          ROIcoords[0][2][0] + "<br/>" + ROIcoords[0][2][1];
        document.getElementById("bottomRight").innerHTML =
          ROIcoords[0][1][0] + "<br/>" + ROIcoords[0][1][1];
        document.getElementById("bottomLeft").innerHTML =
          ROIcoords[0][0][0] + "<br/>" + ROIcoords[0][0][1];

        document.getElementById("topLeftCoord").innerHTML =
          ROIcoords[0][3][0] + " " + ROIcoords[0][3][1];
        document.getElementById("topRightCoord").innerHTML =
          ROIcoords[0][2][0] + " " + ROIcoords[0][2][1];
        document.getElementById("bottomRightCoord").innerHTML =
          ROIcoords[0][1][0] + " " + ROIcoords[0][1][1];
        document.getElementById("bottomLeftCoord").innerHTML =
          ROIcoords[0][0][0] + " " + ROIcoords[0][0][1];
      });
    }
  }

  // Add region of interest
  AddRegionOfInterest(): void {
    const startDate = new Date();
    const functionName = "Add RoI in ship map";
    this.functionservice.functionCallLogging(functionName);
    this.regionsubmitted = true;
    if (this.regionFrom.invalid) {
      return;
    }
    if (this.regionFrom.value.roi.trim() === "") {
      this.regionFrom.controls.roi.setErrors({ empty: true });
      return;
    }
    this.map.removeInteraction(this.draw);
    const topLeft = document.getElementById("topLeftCoord").innerText;
    const topRight = document.getElementById("topRightCoord").innerText;
    const bottomRight = document.getElementById("bottomRightCoord").innerText;
    const bottomLeft = document.getElementById("bottomLeftCoord").innerText;
    const coordsValue =
      "(" +
      topLeft +
      "," +
      topRight +
      "," +
      bottomRight +
      "," +
      bottomLeft +
      "," +
      topLeft +
      ")";
    this.regionFrom.setValue({
      roi: this.regionFrom.value.roi,
      coord: coordsValue,
      userid: this.userId,
    });
    this.loginStatus = this.cookieService.get("loginStatus");
    if (this.loginStatus === "true") {
      this.service.addRoI(this.regionFrom.value).subscribe(
        (data) => {
          if (data.status === "success") {
            this.toastr.success(
              this.regionFrom.value.roi + " is added to region of interest",
              "",
              {
                timeOut: 3000,
              }
            );
            this.computationMessage =
              "Statistical and timeline info computation is under process.It may take 5-10 mins.";
            document.getElementById("opensoiroicomputation").click();
            document.getElementById("closeroimodel").click();
            this.Dataservice.ROIupdate("update roi details");
            this.map.removeInteraction(this.draw);
            this.regionsubmitted = false;
            this.regionFrom.setValue({
              roi: "",
              coord: "",
              userid: this.userId,
            });
            document
              .getElementById("markarea-color")
              .setAttribute("class", "btn markarea");
            const endDate = new Date();
            const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
            this.functionservice.successLogging(
              functionName + " success",
              seconds
            );
          }
        },
        (error) => {
          document
            .getElementById("markarea-color")
            .setAttribute("class", "btn markarea");
          const endDate = new Date();
          const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
          if (error.status === "failure") {
            this.regionFrom.controls.roi.setErrors({ duplicate: true });
            this.functionservice.errorLogging(
              functionName,
              error.message,
              seconds
            );
          } else {
            this.functionservice.PostErrorCond(error, functionName, seconds);
          }
        }
      );
    }
  }

  // remove interaction
  removeinteraction(): void {
    if (document.getElementById("markarea-color") !== null) {
      document
        .getElementById("markarea-color")
        .setAttribute("class", "btn markarea");
    }
    this.map.removeInteraction(this.draw);
    this.regionsubmitted = false;
    this.regionFrom.setValue({
      roi: "",
      coord: "",
      userid: this.userId,
    });
  }

  // open delete roi model
  openDeleteRoIModel(val): void {
    document.getElementById("openroideleteModel").click();
    this.deletingroi = val;
    this.deletingregionname = val.Region_ID;
  }

  // open delete roi
  deleteRoI(): void {
    const startDate = new Date();
    const functionName = "Delete RoI in ship map";
    this.functionservice.functionCallLogging(functionName);
    const val = this.deletingroi;
    this.loginStatus = this.cookieService.get("loginStatus");
    if (this.loginStatus === "true") {
      const deleteData = { userid: this.userId, roi: val.Region_ID };
      this.service.deleteRoI(deleteData).subscribe(
        (data) => {
          if (data.status === "success") {
            this.toastr.success(
              "Deleted " +
                this.deletingregionname +
                " from region of interest ",
              "",
              {
                timeOut: 3000,
              }
            );
            this.map
              .getLayers()
              .getArray()
              .filter((layer) => layer.get("name") === val.Region_ID)
              .forEach((layer) => {
                layer.getSource().clear();
                this.map.removeLayer(layer);
              });
            this.Dataservice.ROIupdate("update roi details");
            document.getElementById("closedeleteroimodel").click();
            const endDate = new Date();
            const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
            this.functionservice.successLogging(
              functionName + " success",
              seconds
            );
          }
        },

        (error) => {
          const endDate = new Date();
          const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
          this.functionservice.PostErrorCond(error, functionName, seconds);
        }
      );
    }
  }

  // edit roi model
  openEditRoI(r): void {
    document.getElementById("openEditROIModel").click();
    this.editingregion = r;
  }

  // edit roi
  editRoI(): void {
    const startDate = new Date();
    const functionName = "Edit RoI in ship map";
    this.functionservice.functionCallLogging(functionName);
    this.editregionsubmitted = true;
    if (this.editregionForm.invalid) {
      return;
    }
    if (this.editregionForm.value.new_roi.trim() === "") {
      this.editregionForm.controls.new_roi.setErrors({ empty: true });
      return;
    }
    this.editregionForm.setValue({
      userid: this.userId,
      old_roi: this.editingregion.Region_ID,
      new_roi: this.editregionForm.value.new_roi,
      top_left_coord: this.editingregion.top_left_coord,
      bottom_right_coord: this.editingregion.bottom_right_coord,
      top_right_coord: this.editingregion.top_right_coord,
      bottom_left_coord: this.editingregion.bottom_left_coord,
    });
    if (this.editingregion.Region_ID === this.editregionForm.value.new_roi) {
      this.editregionForm.controls.new_roi.setErrors({ samename: true });
      return;
    }
    if (this.loginStatus === "true") {
      this.service.editRoI(this.editregionForm.value).subscribe(
        (data) => {
          if (data.status === "success") {
            this.toastr.success(
              "Updated region name " +
                this.editingregion.Region_ID +
                " to " +
                this.editregionForm.value.new_roi,
              "",
              {
                timeOut: 3000,
              }
            );
            document.getElementById("closeeditroiModel").click();
            this.editregionsubmitted = false;
            this.Dataservice.ROIupdate("update roi details");
            this.editregionForm.setValue({
              userid: this.userId,
              old_roi: "",
              new_roi: "",
              top_left_coord: "",
              bottom_right_coord: "",
              top_right_coord: "",
              bottom_left_coord: "",
            });
            const endDate = new Date();
            const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
            this.functionservice.successLogging(
              functionName + " success",
              seconds
            );
          }
        },

        (error) => {
          const endDate = new Date();
          const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
          if (error.status === "failure") {
            this.editregionForm.controls.new_roi.setErrors({ duplicate: true });
            this.functionservice.errorLogging(
              functionName,
              error.message,
              seconds
            );
          } else {
            this.functionservice.PostErrorCond(error, functionName, seconds);
          }
        }
      );
    }
  }

  // close edit roi
  closeEditRoIModel(): void {
    this.editregionsubmitted = false;
    this.editregionForm.setValue({
      userid: this.userId,
      old_roi: "",
      new_roi: "",
      top_left_coord: "",
      bottom_right_coord: "",
      top_right_coord: "",
      bottom_left_coord: "",
    });
  }

  // End Region of interest

  predictRoute(): void {
    document.getElementById("pastRoute").setAttribute("class", "active-btn");
    this.setButtonStateInPopup(true);
    const startDate = new Date();
    const functionName = "Predict Route in ship map";
    this.functionservice.functionCallLogging(functionName);
    const reqData = {
      mmsi: this.selectedmmsi,
      no_past_history: 10,
      no_points_to_predict: 10,
      time: this.selectedpopupData.tm,
    };
    this.service.getPredictRoute(reqData).subscribe(
      (data) => {
        if (data.status === "success") {
          this.setButtonStateInPopup(false);
          this.plotPredictRoute(data.data);
          this.modelName = "Model name: Predict Route";
          this.predictedclasspreprocesstime =
            "Processing took : " + data.preprocess_time;
          this.predictedclassmodeltime = "Model Took : " + data.Pred_time;
          const endDate = new Date();
          const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
          this.functionservice.successLogging(
            functionName + " success",
            seconds
          );
        }
      },
      (error) => {
        this.setButtonStateInPopup(false);
        const endDate = new Date();
        const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
        this.functionservice.PostErrorCond(error, functionName, seconds);
      }
    );

    // const reqData = {
    //   mmsi: this.selectedmmsi,
    //   time: this.selectedpopupData.tm
    // };
    // this.service.getPredictRouteWithTime(reqData).subscribe(
    //   (data) => {
    //     if (data.status === 'success') {
    //       this.plotPredictedPoint(data.data);
    //       const endDate = new Date();
    //       const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
    //       this.functionservice.successLogging(functionName + ' success', seconds);
    //     }
    //   },
    //   (error) => {
    //     const endDate = new Date();
    //     const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
    //     this.functionservice.PostErrorCond(error, functionName, seconds);
    //   }
    // );
  }

  plotPredictedPoint(data): void {
    const pointFeature = [];
    const pointSource = new VectorSource();
    pointFeature.push(
      new Feature({
        geometry: new Point([data.Longitude, data.Latitude]),
      })
    );
    pointSource.addFeatures(pointFeature);
    const pointStyle = {
      symbol: {
        symbolType: "image",
        src: "../../assets/soi/circle.svg",
        size: 15,
        color: "YELLOW",
        rotateWithView: true,
        offset: [0, 0],
        opacity: 0.8,
      },
    };
    this.map.addLayer(
      new WebGLPoints({
        source: pointSource,
        name: "Predicted Point Layers",
        style: pointStyle,
      })
    );
  }

  plotPredictRoute(data): void {
    const polygoncoordinates = [];
    const trajectoryfeature = [];
    const trajectoryPointforonetrack = [];
    data.forEach((d) => {
      const trajData = { mmsi: d.mmsi, tm: d.base_date_time };
      polygoncoordinates.push([d.long, d.lat]);
      trajectoryPointforonetrack.push(
        new Feature({
          geometry: new Point([d.long, d.lat]),
          RoutePredictedData: trajData,
          cog: d.cog,
        })
      );
    });
    trajectoryfeature.push(
      new Feature({
        geometry: new MultiLineString([polygoncoordinates]),
      })
    );
    trajectoryfeature[0].setStyle(
      new Style({
        stroke: new Stroke({
          color: "brown",
          width: 1,
        }),
      })
    );

    this.map.addLayer(
      new VectorLayer({
        source: new VectorSource({
          features: trajectoryfeature,
        }),
        name: "Predict Route",
      })
    );

    this.map.addLayer(
      new WebGLPoints({
        source: new VectorSource({
          features: trajectoryPointforonetrack,
        }),
        name: "Predict Route points",
        style: {
          symbol: {
            symbolType: "image",
            src: "../../assets/Circle-Boat_arrow.png",
            rotateWithView: true,
            size: [
              "match",
              ["get", "indexVal"],
              "index:0",
              20,
              "index:last",
              20,
              10,
            ],
            color: [
              "match",
              ["get", "indexVal"],
              "index:0",
              "#FF0000",
              "index:last",
              "#008000",
              "#0000FF",
            ],
            offset: [0, 0],
            textureCoord: [
              "match",
              ["get", "indexVal"],
              "index:0",
              [0, 0, 0.5, 0.5],
              "index:last",
              [0.5, 0, 1, 1],
              [0, 0.5, 0.5, 1],
            ],
            rotation: ["*", ["get", "cog"], Math.PI / 180],
            opacity: 0.8,
          },
        },
      })
    );

    this.trajectoryOver();
  }

  pastTrack(): void {
    document.getElementById("pastTrack").setAttribute("class", "active-btn");
    this.setButtonStateInPopup(true);
    const startDate = new Date();
    const functionName = "Get Past Track";
    this.functionservice.functionCallLogging(functionName);
    const reqData = {
      mmsi: this.selectedmmsi,
      localtime: this.localtime,
    };
    this.service.getPastTrack(reqData).subscribe(
      (data) => {
        if (data.status === "success") {
          this.setButtonStateInPopup(false);
          this.pastTrackData = data.data[0];
          this.plotPastTrack();
          const endDate = new Date();
          const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
          this.functionservice.successLogging(
            functionName + " success",
            seconds
          );
        }
      },
      (error) => {
        this.setButtonStateInPopup(false);
        const endDate = new Date();
        const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
        this.functionservice.PostErrorCond(error, functionName, seconds);
      }
    );
  }

  setButtonStateInPopup(data): void {
    if (data === true) {
      this.progressbar = true;
      document
        .getElementById("disable-mapevent")
        .setAttribute("style", "cursor:progress;pointer-events:none;");
      document.getElementById("overall").setAttribute("style", "cursor: wait;");
      document
        .getElementById("addFav")
        .setAttribute("style", "cursor:progress;pointer-events:none;");
      document
        .getElementById("predictType")
        .setAttribute("style", "cursor:progress;pointer-events:none;");
      document
        .getElementById("predictDestination")
        .setAttribute("style", "cursor:progress;pointer-events:none;");
      document
        .getElementById("pastTrackDiv")
        .setAttribute("style", "cursor:progress;pointer-events:none;");
      document
        .getElementById("pastRoute")
        .setAttribute("style", "cursor:progress;pointer-events:none;");
    }
    if (data === false) {
      this.progressbar = false;
      document
        .getElementById("disable-mapevent")
        .setAttribute("style", "cursor:default;");
      document
        .getElementById("overall")
        .setAttribute("style", "cursor: default;");
      document
        .getElementById("addFav")
        .setAttribute("style", "cursor: pointer;");
      document
        .getElementById("predictType")
        .setAttribute("style", "cursor: pointer;");
      document
        .getElementById("predictDestination")
        .setAttribute("style", "cursor: pointer;");
      document
        .getElementById("pastTrackDiv")
        .setAttribute("style", "cursor: pointer;");
      document
        .getElementById("pastRoute")
        .setAttribute("style", "cursor: pointer;");
    }
  }

  plotPastTrack(): void {
    const polygoncoordinates = [];
    const trajectoryfeature = [];
    const trajectoryPointforonetrack = [];
    const msi = "msi";
    const id = "id";
    const pts = "pts";
    const trajData = {
      mmsi: this.pastTrackData[msi],
      id: this.pastTrackData[id],
    };
    this.pastTrackData[pts].forEach((d) => {
      polygoncoordinates.push([d.lg, d.lt]);
      trajectoryPointforonetrack.push(
        new Feature({
          geometry: new Point([d.lg, d.lt]),
          PastTrackData: trajData,
          cog: d.cg,
        })
      );
    });
    trajectoryfeature.push(
      new Feature({
        geometry: new MultiLineString([polygoncoordinates]),
      })
    );
    trajectoryfeature[0].setStyle(
      new Style({
        stroke: new Stroke({
          color: "brown",
          width: 1,
        }),
      })
    );

    trajectoryfeature.push(
      new Feature({
        geometry: new Point(polygoncoordinates[0]),
      })
    );

    trajectoryfeature[1].setStyle(
      new Style({
        image: new Icon({
          src: "../../assets/soi/circle.svg",
          scale: 1,
        }),
      })
    );

    this.map.addLayer(
      new VectorLayer({
        source: new VectorSource({
          features: trajectoryfeature,
        }),
        name: "Past Route",
      })
    );

    this.map.addLayer(
      new WebGLPoints({
        source: new VectorSource({
          features: trajectoryPointforonetrack,
        }),
        name: "Past Route points",
        style: this.trajpointsStyle,
      })
    );

    this.trajectoryOver();
  }

  predictDestination(): void {
    this.predictdestination = true;
    this.setButtonStateInPopup(true);
    const startDate = new Date();
    const functionName = "Predict Destination in ship map";
    this.functionservice.functionCallLogging(functionName);
    const reqData = {
      mmsi: this.selectedmmsi,
      time: this.localtime,
    };
    this.service.getPredictDestination(reqData).subscribe(
      (data) => {
        if (data.status === "success") {
          this.setButtonStateInPopup(false);
          this.predictedDestination = data.Destination;
          this.modelName = "Model name: Predict Destination";
          this.predictedclasspreprocesstime =
            "Processing took : " + data.Preprocess_time;
          this.predictedclassmodeltime = "Model Took : " + data.Pred_time;
          this.plotPredictedDestination(
            data.Destination,
            data.trajlat,
            data.trajlong
          );
          const endDate = new Date();
          const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
          this.functionservice.successLogging(
            functionName + " success",
            seconds
          );
        }
      },
      (error) => {
        this.setButtonStateInPopup(false);
        const endDate = new Date();
        const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
        this.functionservice.PostErrorCond(error, functionName, seconds);
      }
    );
  }

  plotPredictedDestination(dest, lt, lg): void {
    const pointFeature = [];
    const pointSource = new VectorSource();
    const d = { destination: dest };
    pointFeature.push(
      new Feature({
        geometry: new Point([lg, lt]),
        DestinationPredictedData: d,
      })
    );
    pointSource.addFeatures(pointFeature);
    const pointStyle = {
      symbol: {
        symbolType: "image",
        src: "../../assets/map/Ports_predicted.svg",
        size: 15,
        color: "YELLOW",
        rotateWithView: true,
        offset: [0, 0],
        opacity: 0.8,
      },
    };
    this.map.addLayer(
      new WebGLPoints({
        source: pointSource,
        name: "Predict Destination Layers",
        style: pointStyle,
      })
    );
    this.trajectoryOver();
    const highlightFeature = [];
    highlightFeature.push(
      new Feature({
        geometry: new Point([lg, lt]),
      })
    );

    this.map.addLayer(
      new VectorLayer({
        source: new VectorSource({
          features: highlightFeature,
        }),
        name: "Highlight Predict Destination Layers",
      })
    );
    const gifUrl = "../../assets/ripple.gif";
    const gif = gifler(gifUrl);
    const that = this.map;
    gif.frames(
      document.createElement("canvas"),
      (ctx, frame): any => {
        highlightFeature.forEach((mmsi) => {
          if (!mmsi.getStyle()) {
            mmsi.setStyle(
              new Style({
                image: new Icon({
                  img: ctx.canvas,
                  imgSize: [frame.width, frame.height],
                  opacity: 1,
                }),
              })
            );
          }
        });
        ctx.clearRect(0, 0, frame.width, frame.height);
        ctx.drawImage(frame.buffer, frame.x, frame.y);
        that.renderSync();
      },
      true
    );
    // if (containsXY(this.map.getView().calculateExtent(this.map.getSize()), lg, lt) === false ) {
    //   this.map.getView().setZoom(2);
    //   this.Dataservice.changeZoomLevel(parseInt(this.map.getView().getZoom()));
    //  }
    while (
      containsXY(
        this.map.getView().calculateExtent(this.map.getSize()),
        lg,
        lt
      ) === false
    ) {
      this.map.getView().setZoom(this.map.getView().getZoom() - 1);
      this.Dataservice.changeZoomLevel(parseInt(this.map.getView().getZoom()));
      continue;
    }
  }

  toggleSecondNavbar(): void {
    this.collapseNav = !this.collapseNav;
    if (this.isExpanded === true && this.collapseNav === true) {
      document
        .getElementById("collapse-sidenav")
        .setAttribute("style", "left:475px;display:block;");
      document
        .getElementById("secondnavbar")
        .setAttribute(
          "style",
          "left:200px;display:block;padding: 0px;position: fixed;opacity: 0.8;z-index: 1;width: 280px;"
        );
    } else if (this.isExpanded === true && this.collapseNav === false) {
      document
        .getElementById("collapse-sidenav")
        .setAttribute("style", "left:200px;display:block;");
      document
        .getElementById("secondnavbar")
        .setAttribute("style", "display: none");
    } else if (this.isExpanded === false && this.collapseNav === true) {
      document
        .getElementById("collapse-sidenav")
        .setAttribute("style", "left:350px;display:block;");
      document
        .getElementById("secondnavbar")
        .setAttribute(
          "style",
          "left:75px;display:block;padding: 0px;position: fixed;opacity: 0.8;z-index: 1;width: 280px;"
        );
    } else if (this.isExpanded === false && this.collapseNav === false) {
      document
        .getElementById("collapse-sidenav")
        .setAttribute("style", "left:75px;display:block;");
      document
        .getElementById("secondnavbar")
        .setAttribute("style", "display: none");
    }
  }

  predictClass(): void {
    this.predictclass = true;
    this.setButtonStateInPopup(true);
    const startDate = new Date();
    const functionName = "Predict Class in ship map";
    this.functionservice.functionCallLogging(functionName);
    const predictclassdata = {
      mmsi: this.selectedpopupData.msi,
      time: this.localtime,
      limit: 100,
    };
    this.service.getPredictClass(predictclassdata).subscribe(
      (data) => {
        if (data.status === "success") {
          this.setButtonStateInPopup(false);
          this.predictedclasstype = data.data;
          this.predictedclasstypelength = this.predictedclasstype.length;
          this.modelName = "Model name: Predict Vessel Type";
          this.predictedclasspreprocesstime =
            "Processing took:" + data.preprocess_time;
          this.predictedclassmodeltime = "Model Took:" + data.Pred_time;
          const endDate = new Date();
          const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
          this.functionservice.successLogging(
            functionName + " success",
            seconds
          );
        }
      },
      (error) => {
        this.setButtonStateInPopup(false);
        const endDate = new Date();
        const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
        this.functionservice.PostErrorCond(error, functionName, seconds);
      }
    );
  }

  // get ship type deviation deatils on click of explain button
  getPredictedTypeExplain(): void {
    const startDate = new Date();
    const functionName = "Predicted Type Explain in ship map";
    this.functionservice.functionCallLogging(functionName);
    const rqdetails = {
      mmsi: this.selectedpopupData.msi,
      cat: this.selectedpopupData.ct,
      sog: this.selectedpopupData.sg,
      cog: this.selectedpopupData.cg,
      length: this.selectedpopupData.ln,
      width: this.selectedpopupData.wd,
      heading: this.selectedpopupData.hd,
    };
    const reqdata = {
      userid: this.userId,
      details: rqdetails,
      label: this.labelCount,
    };
    this.service.getPredictedTypeExplain(reqdata).subscribe(
      (data) => {
        if (data.status === "success") {
          this.predictionOptions = data.url;
          this.setPredImageForm.setValue({
            predtype: this.predictionOptions[0].url,
          });
          this.dataUrl = this.setPredImageForm.value.predtype;
          document.getElementById("openExplainforShiptypeDeviaiton").click();

          const jsondata = {
            mmsi: this.selectedpopupData.msi,
            prediction: this.predictedclasstype,
            features: data.features,
            featureValue: data.pred[0].details,
          };
          const newdata = JSON.stringify(jsondata);
          this.cookieService.set("dataObj", newdata);
          const endDate = new Date();
          const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
          this.functionservice.successLogging(
            functionName + " success",
            seconds
          );
        }
      },
      (error) => {
        const endDate = new Date();
        const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
        this.functionservice.PostErrorCond(error, functionName, seconds);
      }
    );
  }

  setPredImage(): void {
    this.dataUrl = this.setPredImageForm.value.predtype;
  }

  openModeltoAddNewGroup(): void {
    this.togroup = false;
    document.getElementById("add-to-newgroup").click();
    document.getElementById("ship-group").setAttribute("class", "");
  }

  // change clock status event
  receiveClockStatus($event): void {
    this.clockStatus = $event;
    this.cookieService.set("clockStatus", $event);
  }

  // change speed event
  receiveSpeed($event): void {
    this.speed = $event;
  }

  // change local time event
  receiveLocaltime($event): void {
    this.ngOnDestroy();
    this.localtime = $event;
    this.cookieService.set("localtime", this.localtime);
    if (this.soifeatureisselected === "true") {
      this.Dataservice.SOIupdate("Get All soi and goi ships");
    } else if (this.soifeatureisselected === "false") {
      if (this.adjustedClock === "true" || this.clockStatus === false) {
        this.getAllShips();
      } else if (this.clockStatus === true) {
        this.getAllShips_withoutloop();
      }
    }
  }

  // change to full screen evnt
  receiveFullscreen($event): void {
    this.fullscreen();
  }

  // receive features
  receiveFeatures($event): void {
    this.rolefeatures = $event;
  }

  receiveSearchData(message): void {
    this.searchedRequestData = message;
  }

  // receive search result
  receiveSearchResult($event): void {
    const searchedData = $event;
    if (searchedData.length === 0) {
      this.searchFlag = false;
      this.map
        .getLayers()
        .getArray()
        .filter((layer) => layer.get("name") === "Seached Ship")
        .forEach((layer) => {
          layer.getSource().clear();
          this.map.removeLayer(layer);
        });
    } else {
      // const iconFeature = new Feature({
      //   geometry: new Point([searchedData[0].lg, searchedData[0].lt]),
      // });
      this.searchFlag = true;
      const iconFeature = [];
      searchedData.forEach((mmsi) => {
        iconFeature.push(
          new Feature({
            geometry: new Point([mmsi.lg, mmsi.lt]),
          })
        );
      });
      this.map.addLayer(
        new VectorLayer({
          source: new VectorSource({
            features: iconFeature,
          }),
          name: "Seached Ship",
          zIndex: 50,
        })
      );
      if (searchedData.length === 1) {
        this.map.getView().setCenter([searchedData[0].lg, searchedData[0].lt]);
      }
      const gifUrl = "../../assets/ripple.gif";
      const gif = gifler(gifUrl);
      const that = this.map;
      gif.frames(
        document.createElement("canvas"),
        (ctx, frame): any => {
          iconFeature.forEach((mmsi) => {
            if (!mmsi.getStyle()) {
              mmsi.setStyle(
                new Style({
                  image: new Icon({
                    img: ctx.canvas,
                    imgSize: [frame.width, frame.height],
                    opacity: 1,
                  }),
                })
              );
            }
          });
          ctx.clearRect(0, 0, frame.width, frame.height);
          ctx.drawImage(frame.buffer, frame.x, frame.y);
          that.renderSync();
        },
        true
      );
    }
  }
  // SOI
  // selected soi event
  receiveSoiSeletected(message): void {
    // amal
    this.map
      .getLayers()
      .getArray()
      .filter((layer) => layer.get("name") === "Seached Ship")
      .forEach((layer) => {
        layer.getSource().clear();
        this.map.removeLayer(layer);
      });
    // amal
    if (message === "Stop Live Map") {
      this.soifeatureisselected = "true";
      // stop live map
      if (this.plottimerfunction) {
        clearInterval(this.plottimerfunction);
      }
      // remove ship layer.
      this.map
        .getLayers()
        .getArray()
        .filter((layer) => layer.get("name") === "ShipLayer")
        .forEach((layer) => {
          layer.getSource().clear();
          this.map.removeLayer(layer);
        });
      // plot soi ships
    }
    if (message === "Restart Live Map") {
      this.startLiveMap();
      this.soifeatureisselected = "false";
    }
    if (message !== "Stop Live Map" && message !== "Restart Live Map") {
      this.plotSoIShips(message);
      this.soifeatureisselected = "true";
    }
  }

  startLiveMap(): void {
    if (document.getElementById("soi-top-pannel") !== null) {
      document
        .getElementById("soi-top-pannel")
        .setAttribute("style", "cursor:progress;pointer-events:none;");
    }
    if (this.plottimerfunction) {
      clearInterval(this.plottimerfunction);
    }
    if (this.adjustedClock === "true" || this.clockStatus === false) {
      this.getAllShips();
    } else if (this.clockStatus === true) {
      this.getAllShips_withoutloop();
    }
  }

  // delete soi event
  receiveDeleteSoI(data): void {
    this.openDeleteSoiModel(data);
  }

  // soi track traj event
  receiveTrackTraj(msg): void {
    if (msg.length >= 1) {
      const track = msg;
      track.forEach((t) => {
        const trajData = { msi: t.msi, id: t.id };
        let layerName;
        const trajectoryfeature = [];
        const polygoncoordinates = [];
        const trajectoryPointforonetrack = [];
        t.pts.forEach((tH, i) => {
          polygoncoordinates.push([tH.lg, tH.lt]);
          trajectoryPointforonetrack.push(
            new Feature({
              geometry: new Point([tH.lg, tH.lt]),
              indexVal: "index:" + i,
              trajectoryData: trajData,
              cog: tH.cg,
            })
          );
        });

        trajectoryfeature.push(
          new Feature({
            geometry: new MultiLineString([polygoncoordinates]),
            trajectoryData: trajData,
          })
        );
        trajectoryfeature[0].setStyle(
          new Style({
            stroke: new Stroke({
              color: "brown",
              width: 1,
            }),
          })
        );

        if (track.gid !== "") {
          layerName = track.gid + "_" + t.msi + "_" + t.id;
          trajectoryPointforonetrack[t.pts.length - 1].set(
            "indexVal",
            "index:last"
          );
          this.map.addLayer(
            new WebGLPoints({
              source: new VectorSource({
                features: trajectoryPointforonetrack,
              }),
              name: layerName + "points",
              style: this.trajpointsStyle,
            })
          );
        } else {
          layerName = t.msi + "_" + t.id;

          // add 1st and last points in traj
          trajectoryfeature.push(
            new Feature({
              geometry: new Point(polygoncoordinates[0]),
            })
          );

          trajectoryfeature[1].setStyle(
            new Style({
              image: new Icon({
                src: "../../assets/soi/circle.svg",
                scale: 1,
              }),
            })
          );

          trajectoryfeature.push(
            new Feature({
              geometry: new Point(polygoncoordinates[t.pts.length - 1]),
            })
          );

          trajectoryfeature[2].setStyle(
            new Style({
              image: new Icon({
                src: "../../assets/soi/ship-green.svg",
                scale: 1,
                rotation: (Math.PI / 180) * t.pts[t.pts.length - 1].cg,
              }),
            })
          );
          // end add 1st and last points in traj
        }

        this.map.addLayer(
          new VectorLayer({
            source: new VectorSource({
              features: trajectoryfeature,
            }),
            name: layerName,
          })
        );
      });
    }
    this.trajectoryOver();
  }

  // remove soi track traj event
  receiveRemoveTrackTraj(layername): void {
    this.map
      .getLayers()
      .getArray()
      .filter(
        (layer) =>
          layer.get("name") === layername + "points" ||
          layer.get("name") === layername
      )
      .forEach((layer) => {
        layer.getSource().clear();
        this.map.removeLayer(layer);
      });
  }

  // soi ship type deviation traj event
  receiveShipTypeDeviationTraj(track): void {
    track.forEach((t) => {
      const trajData = { msi: t.msi, id: t.id };
      let layerName;
      if (track.gid !== "") {
        layerName =
          track.gid + "_" + t.msi + "_" + t.id + "_" + "goishiptypedeviation";
      } else {
        layerName = t.msi + "_" + t.id + "_" + "shiptypedeviation";
      }
      const trajectoryfeature = [];
      const polygoncoordinates = [];
      const trackhistory = t.pts;
      const trajectoryPointforonetrack = [];
      trackhistory.forEach((tH, i) => {
        polygoncoordinates.push([tH.lg, tH.lt]);
        trajectoryPointforonetrack.push(
          new Feature({
            geometry: new Point([tH.lg, tH.lt]),
            indexVal: "index:" + i,
            trajectoryData: trajData,
            cog: tH.cg,
          })
        );
      });

      trajectoryfeature.push(
        new Feature({
          geometry: new MultiLineString([polygoncoordinates]),
          trajectoryData: trajData,
        })
      );
      trajectoryfeature[0].setStyle(
        new Style({
          stroke: new Stroke({
            color: "brown",
            width: 1,
          }),
        })
      );
      trajectoryPointforonetrack[trackhistory.length - 1].set(
        "indexVal",
        "index:last"
      );

      this.map.addLayer(
        new WebGLPoints({
          source: new VectorSource({
            features: trajectoryPointforonetrack,
          }),
          name: layerName + "points",
          style: this.trajpointsStyle,
        })
      );
      this.map.addLayer(
        new VectorLayer({
          source: new VectorSource({
            features: trajectoryfeature,
          }),
          name: layerName,
        })
      );
      this.trajectoryOver();
    });
  }

  // soi ship type anomaly traj event

  receiveShipTypeAnomaly(shiptypeanamolypoints): void {
    let layerName;
    if (shiptypeanamolypoints.gid !== undefined) {
      layerName =
        shiptypeanamolypoints.gid +
        "_" +
        shiptypeanamolypoints.mmsi +
        "_" +
        shiptypeanamolypoints.tj +
        "_" +
        "goishiptypedeviation";
    } else {
      layerName =
        shiptypeanamolypoints.mmsi +
        "_" +
        shiptypeanamolypoints.tj +
        "_shiptypedeviation";
    }

    const shiptypeanomalyPointforonetrack = [];
    shiptypeanamolypoints.forEach((anomalypoint, i) => {
      shiptypeanomalyPointforonetrack.push(
        new Feature({
          geometry: new Point([anomalypoint.lg, anomalypoint.lt]),
          shiptypeanmolyData: anomalypoint,
        })
      );
      shiptypeanomalyPointforonetrack[i].setStyle(
        new Style({
          image: new Icon({
            src: "../../assets/map/alert.svg",
            scale: 1,
          }),
        })
      );
    });
    this.map.addLayer(
      new VectorLayer({
        source: new VectorSource({
          features: shiptypeanomalyPointforonetrack,
        }),
        name: layerName + "anomaly",
        trajectoryClass: layerName,
      })
    );
  }

  // remove anomaly traj
  receiveRemoveAnomalyTraj(layername): void {
    this.map
      .getLayers()
      .getArray()
      .filter(
        (layer) =>
          layer.get("name") === layername + "anomaly" ||
          layer.get("name") === layername + "points" ||
          layer.get("name") === layername
      )
      .forEach((layer) => {
        layer.getSource().clear();
        this.map.removeLayer(layer);
      });
  }

  receivAanchorageAnomalyTraj(track): void {
    track.forEach((t) => {
      const trajData = { msi: t.msi, id: t.id };
      let layerName;
      if (track.gid !== "") {
        layerName =
          track.gid + "_" + t.msi + "_" + t.id + "_" + "goianchorageanomaly";
      } else {
        layerName = t.msi + "_" + t.id + "_" + "anchorageanomaly";
      }
      const trajectoryfeature = [];
      const polygoncoordinates = [];
      const trackhistory = t.pts;
      const trajectoryPointforonetrack = [];
      trackhistory.forEach((tH, i) => {
        polygoncoordinates.push([tH.lg, tH.lt]);
        trajectoryPointforonetrack.push(
          new Feature({
            geometry: new Point([tH.lg, tH.lt]),
            indexVal: "index:" + i,
            trajectoryData: trajData,
            cog: tH.cg,
          })
        );
      });

      trajectoryfeature.push(
        new Feature({
          geometry: new MultiLineString([polygoncoordinates]),
          trajectoryData: trajData,
        })
      );
      trajectoryfeature[0].setStyle(
        new Style({
          stroke: new Stroke({
            color: "brown",
            width: 1,
          }),
        })
      );
      trajectoryPointforonetrack[trackhistory.length - 1].set(
        "indexVal",
        "index:last"
      );

      this.map.addLayer(
        new WebGLPoints({
          source: new VectorSource({
            features: trajectoryPointforonetrack,
          }),
          name: layerName + "points",
          style: this.trajpointsStyle,
        })
      );
      this.map.addLayer(
        new VectorLayer({
          source: new VectorSource({
            features: trajectoryfeature,
          }),
          name: layerName,
        })
      );
      this.trajectoryOver();
    });
  }

  receiveAnchorageAnomaly(anchorageanamolypoints): void {
    let layername;
    if (anchorageanamolypoints.gid !== "") {
      layername =
        anchorageanamolypoints.gid +
        "_" +
        anchorageanamolypoints.mmsi +
        "_" +
        anchorageanamolypoints.tj +
        "_" +
        "goianchorageanomaly";
    } else {
      layername =
        anchorageanamolypoints.mmsi +
        "_" +
        anchorageanamolypoints.tj +
        "_anchorageanomaly";
    }
    const anchorageanomalyPointforonetrack = [];
    anchorageanamolypoints.forEach((anomaly, i) => {
      anchorageanomalyPointforonetrack.push(
        new Feature({
          geometry: new Point([anomaly.lg, anomaly.lt]),
          anchorageAnomalyData: anomaly,
        })
      );
      anchorageanomalyPointforonetrack[i].setStyle(
        new Style({
          image: new Icon({
            src: "../../assets/map/alert.svg",
            scale: 1,
          }),
        })
      );
    });
    this.map.addLayer(
      new VectorLayer({
        source: new VectorSource({
          features: anchorageanomalyPointforonetrack,
        }),
        name: layername + "anomaly",
        trajectoryClass: layername,
      })
    );
  }

  // receive selected goi event
  receiveGoiSeletected(message): void {
    this.plotShips(this.allshipsData);
  }

  // receive edit goi event
  receiveEditGoi(gid): void {
    this.openEditGoI(gid);
  }

  // receive delete goi event
  receiveDeleteGOI(g): void {
    this.openDeleteGoIModel(g);
  }

  // receive delete mmsi in goi event
  receiveDeleteGoIMMSI(data): void {
    this.openDeleteMMSIOfGoIModel(data.gid, data.mmsi);
  }

  // Region of interest

  // add/remove interaction event
  receiveMarkArea(msg): void {
    if (msg === "yes") {
      this.addInteraction();
    } else if (msg === "no") {
      this.removeinteraction();
    }
  }

  // draw region on select event
  receiveDrawRegion(data): void {
    const roifeatures = [];
    roifeatures.push(
      new Feature({
        geometry: new Polygon(data.points),
        regionData: data.regionid,
      })
    );
    const cnv = document.createElement("canvas");
    const ctx = cnv.getContext("2d");
    const img = new Image();
    img.src = "../assets/Vessel-Tracking.png";
    img.onload = () => {
      const pattern = ctx.createPattern(img, "repeat");
      roifeatures[0].setStyle(
        new Style({
          stroke: new Stroke({
            color: "yellow",
            width: 3,
          }),
          // fill: new Fill({
          //   color: pattern
          // })
        })
      );
    };

    this.map.addLayer(
      new VectorLayer({
        source: new VectorSource({
          features: roifeatures,
        }),
        name: data.regionid,
      })
    );
    this.map.getView().setCenter(data.points[0][0]);
    // this.map.getView().setZoom(7);
    const regionhovercontainer = document.getElementById("regionhover");
    const regionoverlay = new Overlay({
      element: regionhovercontainer,
      positioning: "center-center",
    });
    this.map.on("pointermove", (e) => {
      if (this.progressbar === false) {
        document.getElementById("map").setAttribute("style", "cursor: default");
      } else {
        document.getElementById("map").setAttribute("style", "cursor: wait");
      }
      const regionDataonhover = e.map.forEachFeatureAtPixel(
        e.pixel,
        (feature): any => {
          return feature;
        }
      );
      if (
        regionDataonhover &&
        regionDataonhover.get("regionData") !== undefined
      ) {
        const region = regionDataonhover.get("regionData");
        regionhovercontainer.setAttribute("style", "display:block");
        regionhovercontainer.innerHTML =
          "<p style=margin-bottom:0px;> <b>Region ID: </b>" + region + "</p>";
        regionoverlay.setOffset([0, 0]);
        regionoverlay.setPositioning("bottom-right");
        regionoverlay.setPosition(e.coordinate);
        const delta = this.getOverlayOffsets(this.map, regionoverlay);
        if (delta[1] > 0) {
          regionoverlay.setPositioning("bottom-center");
        }
        regionoverlay.setOffset(delta);
        this.map.addOverlay(regionoverlay);
      } else {
        if (regionhovercontainer) {
          regionhovercontainer.setAttribute("style", "display:none");
        }
      }
    });
  }

  // remove drwan region in uncheck
  receiveRemoveRegion(layername): void {
    this.map
      .getLayers()
      .getArray()
      .filter((layer) => layer.get("name") === layername)
      .forEach((layer) => {
        layer.getSource().clear();
        this.map.removeLayer(layer);
      });
  }

  // receive roi selected
  receiveRoiSeletected(message): void {
    if (message === "Stop Live Map") {
      // stop live map
      if (this.plottimerfunction) {
        clearInterval(this.plottimerfunction);
      }
      // remove ship layer.
      this.map
        .getLayers()
        .getArray()
        .filter((layer) => layer.get("name") === "ShipLayer")
        .forEach((layer) => {
          layer.getSource().clear();
          this.map.removeLayer(layer);
        });
    }

    if (message === "Show time alert") {
      this.Dataservice.changeNavbarInROI(true);
      this.toastr.info(
        "Your current plotting in based on timeseries selected in panel.",
        "",
        {
          timeOut: 3000,
        }
      );
    }
    if (message === "Restart Live Map") {
      this.startLiveMap();
      this.Dataservice.changeNavbarInROI(false);
    }
    if (
      message !== "Stop Live Map" &&
      message !== "Restart Live Map" &&
      message !== "Show time alert"
    ) {
      this.Dataservice.changeVesselCount(message.length);
      this.plotRoIShips(message);
    }
  }

  // receive edit roi
  receiveEditrroI(roi): void {
    this.openEditRoI(roi);
  }

  // receive delete roi
  receiveDeleteRoI(roi): void {
    this.openDeleteRoIModel(roi);
  }

  receiveTrackTrajectoryPoints(msg): void {
    if (msg === "Select respective trajectory") {
      this.computationMessage = msg + ".";
      document.getElementById("opensoiroicomputation").click();
    } else {
      const trajectoryPointforonetrack = [];
      // const track = msg;
      const layerName = msg.msi + "_" + msg.id;

      const trajData = { msi: msg.msi, id: msg.id };
      msg.pts.forEach((tH, i) => {
        trajectoryPointforonetrack.push(
          new Feature({
            geometry: new Point([tH.lg, tH.lt]),
            indexVal: "index:" + i,
            trajectoryData: trajData,
            cog: tH.cg,
          })
        );
      });
      this.map.addLayer(
        new WebGLPoints({
          source: new VectorSource({
            features: trajectoryPointforonetrack,
          }),
          name: layerName + "points",
          style: this.trajpointsStyle,
        })
      );
    }
  }

  receiveRemoveTrackTrajectoryPoints(layername): void {
    this.map
      .getLayers()
      .getArray()
      .filter((layer) => layer.get("name") === layername)
      .forEach((layer) => {
        layer.getSource().clear();
        this.map.removeLayer(layer);
      });
  }

  receiveRoITrajectory(message): void {
    const layerName = message.rid;
    message.traj.forEach((t) => {
      const trajData = { msi: t.msi, id: t.id };
      const trajectoryfeature = [];
      const polygoncoordinates = [];
      const trackhistory = t.pts;

      trackhistory.forEach((tH) => {
        polygoncoordinates.push([tH.lg, tH.lt]);
      });
      trajectoryfeature.push(
        new Feature({
          geometry: new MultiLineString([polygoncoordinates]),
          trajectoryData: trajData,
        })
      );
      trajectoryfeature[0].setStyle(
        new Style({
          stroke: new Stroke({
            color: "brown",
            width: 1,
          }),
        })
      );

      // add 1st and last points in traj
      trajectoryfeature.push(
        new Feature({
          geometry: new Point(polygoncoordinates[0]),
        })
      );

      trajectoryfeature[1].setStyle(
        new Style({
          image: new Icon({
            src: "../../assets/soi/circle.svg",
            scale: 1,
          }),
        })
      );

      trajectoryfeature.push(
        new Feature({
          geometry: new Point(polygoncoordinates[t.pts.length - 1]),
        })
      );

      trajectoryfeature[2].setStyle(
        new Style({
          image: new Icon({
            src: "../../assets/soi/ship-green.svg",
            scale: 1,
            rotation: (Math.PI / 180) * t.pts[t.pts.length - 1].cg,
          }),
        })
      );
      // end add 1st and last points in traj
      this.map.addLayer(
        new VectorLayer({
          source: new VectorSource({
            features: trajectoryfeature,
          }),
          name: "region" + layerName,
        })
      );
      this.trajectoryOver();
    });
  }

  receiveRemoveRoITrajectory(rid): void {
    this.map
      .getLayers()
      .getArray()
      .filter((layer) => layer.get("name") === "region" + rid)
      .forEach((layer) => this.map.removeLayer(layer));
  }

  // Density Map

  receiveDMSeletected(message): void {
    if (message === "Restart Live Map") {
      this.startLiveMap();
    }

    if (message === "Stop Live Map") {
      // stop live map
      if (this.plottimerfunction) {
        clearInterval(this.plottimerfunction);
      }
      // remove ship layer.
      this.map
        .getLayers()
        .getArray()
        .filter((layer) => layer.get("name") === "ShipLayer")
        .forEach((layer) => {
          layer.getSource().clear();
          this.map.removeLayer(layer);
        });
    }
  }

  receiveRange(message): void {
    if (message === "Remove Range") {
      this.rangeValues = [];
    } else if (message !== "Remove Range") {
      this.rangeValues = message;
    }
  }

  receivePlotPorts(message): void {
    if (message === "Switch off show top ports") {
      this.map
        .getLayers()
        .getArray()
        .filter((layer) => layer.get("name") === "Density Ports Layers")
        .forEach((layer) => {
          layer.getSource().clear();
          this.map.removeLayer(layer);
        });
    } else {
      this.plotTopPorts(message);
    }
  }

  plotTopPorts(portsData): void {
    const portsfeature = [];
    const PortsSource = new VectorSource();
    portsData.forEach((port, i) => {
      portsfeature.push(
        new Feature({
          geometry: new Point([port.lg, port.lt]),
          densityPortData: { portName: port.pn },
        })
      );
    });
    PortsSource.addFeatures(portsfeature);
    const portStyle = {
      symbol: {
        symbolType: "image",
        src: "../../../assets/densitymap/ports.svg",
        size: 15,
      },
    };
    this.map.addLayer(
      new WebGLPoints({
        source: PortsSource,
        name: "Density Ports Layers",
        style: portStyle,
      })
    );
    const densityPortHover = document.getElementById("densityPortHover");
    const densityportsoverlay = new Overlay({
      element: densityPortHover,
      positioning: "center-center",
    });
    this.map.on("pointermove", (e) => {
      const portsDataonhover = e.map.forEachFeatureAtPixel(
        e.pixel,
        (feature): any => {
          return feature;
        }
      );
      if (
        portsDataonhover &&
        portsDataonhover.get("densityPortData") !== undefined
      ) {
        const ports = portsDataonhover.get("densityPortData");
        densityPortHover.setAttribute("style", "display:block");
        densityPortHover.innerHTML =
          "<p style=margin-bottom:0px;> <b>Port Name: </b>" +
          ports.portName +
          "</p>";
        densityportsoverlay.setOffset([0, 0]);
        densityportsoverlay.setPositioning("bottom-right");
        densityportsoverlay.setPosition(
          portsDataonhover.getGeometry().getCoordinates()
        );
        this.map.addOverlay(densityportsoverlay);
      } else {
        if (densityPortHover) {
          densityPortHover.setAttribute("style", "display:none");
        }
      }
    });
  }

  receivePlotDensity(message): void {
    const trajectoryfeature = [];
    message.forEach((t, i) => {
      const polygoncoordinates = [];
      t.pts.forEach((tH) => {
        polygoncoordinates.push([tH.lg, tH.lt]);
      });

      trajectoryfeature.push(
        new Feature({
          geometry: new MultiLineString([polygoncoordinates]),
        })
      );
      trajectoryfeature[i].setStyle(
        new Style({
          stroke: new Stroke({
            color: t.clr,
            width: 1,
          }),
        })
      );

      this.map.addLayer(
        new VectorLayer({
          source: new VectorSource({
            features: trajectoryfeature,
          }),
          name: "Density Map Layer",
        })
      );
    });
  }

  receivePlotDensityShips(message): void {
    this.plotDMShips(message);
  }

  // Vessel Filter
  receiveVFSeletected(message): void {
    if (message === "Restart Live Map") {
      this.startLiveMap();
    }

    if (message === "Stop Live Map") {
      // stop live map
      if (this.plottimerfunction) {
        clearInterval(this.plottimerfunction);
      }
      // remove ship layer.
      this.map
        .getLayers()
        .getArray()
        .filter((layer) => layer.get("name") === "ShipLayer")
        .forEach((layer) => {
          layer.getSource().clear();
          this.map.removeLayer(layer);
        });
    }

    if (message !== "Stop Live Map" && message !== "Restart Live Map") {
      this.plotVFShips(message);
    }
  }

  receiveVFSeletectedMark(message): void {
    if (message === "remove") {
      this.map
        .getLayers()
        .getArray()
        .filter((layer) => layer.get("name") === "display extent area")
        .forEach((layer) => {
          layer.getSource().clear();
          this.map.removeLayer(layer);
        });
    } else if (message === "remove add") {
      this.map
        .getLayers()
        .getArray()
        .filter((layer) => layer.get("name") === "add extent area")
        .forEach((layer) => {
          layer.getSource().clear();
          this.map.removeLayer(layer);
        });
    } else {
      this.drawExtentArea("display", message);
    }
  }

  receiveAddExtent(msg): void {
    if (msg === "yes") {
      this.addextent();
    } else if (msg === "no") {
      this.removeextent();
    }
  }

  receiveEditExtent(msg): void {
    if (msg === "yes") {
      this.editExtent();
    }
    if (msg === "no") {
      this.removeextent();
    }
    if (msg === "clear") {
      this.map
        .getLayers()
        .getArray()
        .filter((layer) => layer.get("name") === "edit extent area")
        .forEach((layer) => {
          layer.getSource().clear();
          this.map.removeLayer(layer);
        });
    }
  }

  editExtent(): void {
    clearInterval(this.plottimerfunction);
    let value = "Box";
    if (value !== "None") {
      let geometryfunctions = "";
      if (value === "Square") {
        value = "Circle";
        geometryfunctions = createRegularPolygon(4);
      } else if (value === "Box") {
        value = "Circle";
        geometryfunctions = createBox();
      }

      this.draw = new Draw({
        type: value,
        geometryFunction: geometryfunctions,
      });
      this.map.addInteraction(this.draw);

      this.draw.on("drawend", (evt): void => {
        const feature = evt.feature;
        const extentcoords = feature.getGeometry().getCoordinates();
        this.Dataservice.editExtentInVF(extentcoords);
        this.removeextent();
        this.map
          .getLayers()
          .getArray()
          .filter((layer) => layer.get("name") === "edit extent area")
          .forEach((layer) => {
            layer.getSource().clear();
            this.map.removeLayer(layer);
          });
        this.drawExtentArea("edit", extentcoords);
      });
    }
  }

  addextent(): void {
    this.map
      .getLayers()
      .getArray()
      .filter((layer) => layer.get("name") === "add extent area")
      .forEach((layer) => {
        layer.getSource().clear();
        this.map.removeLayer(layer);
      });
    clearInterval(this.plottimerfunction);
    let value = "Box";
    if (value !== "None") {
      let geometryfunctions = "";
      if (value === "Square") {
        value = "Circle";
        geometryfunctions = createRegularPolygon(4);
      } else if (value === "Box") {
        value = "Circle";
        geometryfunctions = createBox();
      }

      this.draw = new Draw({
        type: value,
        geometryFunction: geometryfunctions,
      });
      this.map.addInteraction(this.draw);

      this.draw.on("drawend", (evt): void => {
        const feature = evt.feature;
        const extentcoords = feature.getGeometry().getCoordinates();
        this.Dataservice.addExtentInVF(extentcoords);
        this.removeextent();
        this.drawExtentArea("add", extentcoords);
      });
    }
  }

  receiveMarkEditEvent(data): void {
    this.map
      .getLayers()
      .getArray()
      .filter((layer) => layer.get("name") === "add extent area")
      .forEach((layer) => {
        layer.getSource().clear();
        this.map.removeLayer(layer);
      });
    this.drawExtentArea("edit", data);
  }

  drawExtentArea(type, data): void {
    const extentfeatures = [];
    extentfeatures.push(
      new Feature({
        geometry: new Polygon(data),
      })
    );

    extentfeatures[0].setStyle(
      new Style({
        stroke: new Stroke({
          color: "yellow",
          width: 3,
        }),
      })
    );

    this.map.addLayer(
      new VectorLayer({
        source: new VectorSource({
          features: extentfeatures,
        }),
        name: type + " extent area",
      })
    );
  }

  removeextent(): void {
    this.map.removeInteraction(this.draw);
  }

  receiveEditPreset(message): void {
    document.getElementById("openEditPresetModel").click();
    this.editingPresetId = message.pid;
    this.editingPresetName = message.pname;
  }

  editPresetName(): void {
    const startDate = new Date();
    const functionName = "Edit Preset name in Vessel Filter";
    this.functionservice.functionCallLogging(functionName);
    this.editpresetsubmitted = true;
    if (this.editpresetForm.invalid) {
      return;
    }
    this.editpresetForm.setValue({
      pid: this.editingPresetId,
      pname: this.editpresetForm.value.pname,
    });
    this.service.editPreset(this.editpresetForm.value).subscribe(
      (data) => {
        if (data.status === "success") {
          this.toastr.success(
            "Updated preset name " +
              this.editingPresetName +
              " to " +
              this.editpresetForm.value.pname,
            "",
            {
              timeOut: 3000,
            }
          );
          this.editpresetForm.setValue({ pid: "", pname: "" });
          document.getElementById("closeeditpresetModel").click();
          this.Dataservice.VesselFilterListUpdate("update vessel filter list");
          const endDate = new Date();
          const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
          this.functionservice.successLogging(
            functionName + " success",
            seconds
          );
        }
      },
      (error) => {
        const endDate = new Date();
        const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
        if (error.status === "failure") {
          this.editpresetForm.controls.pname.setErrors({ duplicate: true });
          this.functionservice.errorLogging(
            functionName,
            error.message,
            seconds
          );
        } else {
          this.functionservice.PostErrorCond(error, functionName, seconds);
        }
      }
    );
  }

  receiveDeletePreset(msg): void {
    document.getElementById("openDeletePresetModel").click();
    this.deletingPresetId = msg.pid;
    this.deletingPresetName = msg.pname;
  }

  deletePreset(): void {
    const startDate = new Date();
    const functionName = "Delete preset";
    this.functionservice.functionCallLogging(functionName);
    this.service.deletePreset(this.deletingPresetId).subscribe(
      (result) => {
        if (result.status === "success") {
          this.toastr.success("Deleted preset " + this.deletingPresetName, "", {
            timeOut: 3000,
          });
          document.getElementById("closedeletepresetmodel").click();
          this.Dataservice.VesselFilterListUpdate("update vessel filter list");
          this.Dataservice.VesselFilterListUpdate(
            "update vessel filter Delete"
          );
          const endDate = new Date();
          const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
          this.functionservice.successLogging(
            functionName + " success",
            seconds
          );
        }
      },
      (error) => {
        const endDate = new Date();
        const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
        this.functionservice.getErrorCond(error, functionName, seconds);
      }
    );
  }

  showvfTrack(): void {
    document
      .getElementById("showvfTrack")
      .setAttribute("class", "btn explain-btn showvfTrack active-btn");
    this.setButtonStateInPopup(true);
    const startDate = new Date();
    const functionName = "Show Vessel Filter Track";
    this.functionservice.functionCallLogging(functionName);
    const reqdata = {
      mmsi: this.vfship.msi,
      from_date: this.vfship.fromdate,
      to_date: this.vfship.todate,
      localtime: this.vfship.localtim,
      flag: 1,
    };
    this.service.getVFTraj(reqdata).subscribe(
      (data) => {
        if (data.status === "success") {
          this.setButtonStateInPopup(false);
          if (data.data[0].traj_details.length === 0) {
            this.toastr.warning("No track for selected filter", "", {
              timeOut: 5000,
            });
          } else {
            this.pastTrackData = data.data[0];
            this.plotVFTrack();
          }
          const endDate = new Date();
          const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
          this.functionservice.successLogging(
            functionName + " success",
            seconds
          );
        }
      },
      (error) => {
        this.setButtonStateInPopup(false);
        const endDate = new Date();
        const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
        this.functionservice.PostErrorCond(error, functionName, seconds);
      }
    );
  }

  plotVFTrack(): void {
    const trajectoryfeature = [];
    const trajectoryPointforonetrack = [];
    const msi = "mmsi";
    const trajdetails = "traj_details";
    this.pastTrackData[trajdetails].forEach((d, i) => {
      const polygoncoordinates = [];
      const trajData = { mmsi: this.pastTrackData[msi], id: d.id };
      d.pts.forEach((traj) => {
        polygoncoordinates.push([traj.lg, traj.lt]);
        trajectoryPointforonetrack.push(
          new Feature({
            geometry: new Point([traj.lg, traj.lt]),
            PastTrackData: trajData,
            cog: traj.cg,
          })
        );
      });

      trajectoryfeature.push(
        new Feature({
          geometry: new MultiLineString([polygoncoordinates]),
        })
      );
      trajectoryfeature[i].setStyle(
        new Style({
          stroke: new Stroke({
            color: "green",
            width: 1,
          }),
        })
      );
    });

    this.map.addLayer(
      new VectorLayer({
        source: new VectorSource({
          features: trajectoryfeature,
        }),
        name: "VF Route",
      })
    );

    this.map.addLayer(
      new WebGLPoints({
        source: new VectorSource({
          features: trajectoryPointforonetrack,
        }),
        name: "VF Route points",
        style: this.trajpointsStyle,
      })
    );

    this.trajectoryOver();
  }
}
