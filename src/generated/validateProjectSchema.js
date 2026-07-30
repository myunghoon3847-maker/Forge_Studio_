// Generated from project.schema.v2.json. Do not edit by hand.
// The standalone validator avoids eval/new Function in the browser.
"use strict";
export const validate = validate20;
export default validate20;
const schema31 = {"$schema":"https://json-schema.org/draft/2020-12/schema","$id":"urn:forge-studio:schema:project:2","title":"Forge Studio Project Schema v2","description":"Authoritative file schema for Forge Studio .forge.json projects.","type":"object","additionalProperties":false,"required":["schemaVersion","appVersion","project","settings","scene"],"properties":{"schemaVersion":{"type":"integer","const":2},"appVersion":{"type":"string","minLength":1,"maxLength":40,"pattern":"^[0-9]+\\.[0-9]+\\.[0-9]+(?:-[0-9A-Za-z.-]+)?$"},"project":{"$ref":"#/$defs/projectMetadata"},"settings":{"$ref":"#/$defs/projectSettings"},"scene":{"$ref":"#/$defs/scene"}},"$defs":{"projectMetadata":{"type":"object","additionalProperties":false,"required":["name","createdAt","updatedAt"],"properties":{"name":{"type":"string","minLength":1,"maxLength":120,"pattern":".*\\S.*"},"createdAt":{"type":"string","format":"date-time"},"updatedAt":{"type":"string","format":"date-time"}}},"projectSettings":{"type":"object","additionalProperties":false,"required":["units","upAxis","assetFront","gridSize","backgroundColor"],"properties":{"units":{"type":"string","const":"meter"},"upAxis":{"type":"string","const":"Y"},"assetFront":{"type":"string","const":"+Z"},"gridSize":{"type":"number","minimum":0.001,"maximum":1000},"backgroundColor":{"$ref":"#/$defs/color"}}},"scene":{"type":"object","additionalProperties":false,"required":["objects"],"properties":{"objects":{"type":"array","maxItems":5000,"items":{"$ref":"#/$defs/sceneObject"}}}},"sceneObject":{"oneOf":[{"$ref":"#/$defs/groupObject"},{"$ref":"#/$defs/meshObject"}]},"baseObject":{"type":"object","required":["id","type","name","parentId","visible","locked","transform"],"properties":{"id":{"type":"string","format":"uuid"},"type":{"type":"string","enum":["group","mesh"]},"name":{"type":"string","minLength":1,"maxLength":120,"pattern":".*\\S.*"},"parentId":{"oneOf":[{"type":"null"},{"type":"string","format":"uuid"}]},"visible":{"type":"boolean"},"locked":{"type":"boolean"},"transform":{"$ref":"#/$defs/transform"},"editor":{"$ref":"#/$defs/editorMetadata"}}},"groupObject":{"type":"object","allOf":[{"$ref":"#/$defs/baseObject"},{"type":"object","properties":{"type":{"const":"group"}}}],"unevaluatedProperties":false},"meshObject":{"type":"object","allOf":[{"$ref":"#/$defs/baseObject"},{"type":"object","required":["geometry","material"],"properties":{"type":{"const":"mesh"},"geometry":{"$ref":"#/$defs/geometry"},"material":{"$ref":"#/$defs/material"}}}],"unevaluatedProperties":false},"transform":{"type":"object","additionalProperties":false,"required":["position","rotation","scale"],"properties":{"position":{"$ref":"#/$defs/position"},"rotation":{"$ref":"#/$defs/rotation"},"scale":{"$ref":"#/$defs/scale"}}},"position":{"type":"array","minItems":3,"maxItems":3,"prefixItems":[{"$ref":"#/$defs/signedCoordinate"},{"$ref":"#/$defs/signedCoordinate"},{"$ref":"#/$defs/signedCoordinate"}],"items":false},"rotation":{"type":"object","additionalProperties":false,"required":["order","radians"],"properties":{"order":{"type":"string","const":"XYZ"},"radians":{"type":"array","minItems":3,"maxItems":3,"prefixItems":[{"$ref":"#/$defs/signedAngle"},{"$ref":"#/$defs/signedAngle"},{"$ref":"#/$defs/signedAngle"}],"items":false}}},"scale":{"type":"array","minItems":3,"maxItems":3,"prefixItems":[{"$ref":"#/$defs/positiveScale"},{"$ref":"#/$defs/positiveScale"},{"$ref":"#/$defs/positiveScale"}],"items":false},"signedCoordinate":{"type":"number","minimum":-1000000,"maximum":1000000},"signedAngle":{"type":"number","minimum":-1000000,"maximum":1000000},"positiveScale":{"type":"number","exclusiveMinimum":0.000001,"maximum":10000},"editorMetadata":{"type":"object","additionalProperties":false,"required":["templateRole"],"properties":{"templateRole":{"type":"string","enum":["none","root","part"]},"templateId":{"type":"string","minLength":1,"maxLength":64,"pattern":"^[a-z0-9]+(?:[.-][a-z0-9]+)*$"},"templateVersion":{"type":"string","minLength":1,"maxLength":40,"pattern":"^[0-9]+\\.[0-9]+\\.[0-9]+(?:-[0-9A-Za-z.-]+)?$"},"templateRootId":{"oneOf":[{"type":"null"},{"type":"string","format":"uuid"}]}}},"material":{"type":"object","additionalProperties":false,"required":["type","color","roughness","metalness","opacity","transparent","wireframe","flatShading","side"],"properties":{"type":{"type":"string","const":"meshStandard"},"color":{"$ref":"#/$defs/color"},"roughness":{"type":"number","minimum":0,"maximum":1},"metalness":{"type":"number","minimum":0,"maximum":1},"opacity":{"type":"number","exclusiveMinimum":0,"maximum":1},"transparent":{"type":"boolean"},"wireframe":{"type":"boolean"},"flatShading":{"type":"boolean"},"side":{"type":"string","enum":["front","back","double"]}}},"color":{"type":"string","pattern":"^#[0-9A-Fa-f]{6}$"},"geometry":{"oneOf":[{"$ref":"#/$defs/boxGeometry"},{"$ref":"#/$defs/sphereGeometry"},{"$ref":"#/$defs/cylinderGeometry"},{"$ref":"#/$defs/coneGeometry"},{"$ref":"#/$defs/planeGeometry"},{"$ref":"#/$defs/torusGeometry"},{"$ref":"#/$defs/icosahedronGeometry"}]},"boxGeometry":{"type":"object","additionalProperties":false,"required":["kind","parameters"],"properties":{"kind":{"const":"box"},"parameters":{"type":"object","additionalProperties":false,"required":["width","height","depth","widthSegments","heightSegments","depthSegments"],"properties":{"width":{"$ref":"#/$defs/positiveLength"},"height":{"$ref":"#/$defs/positiveLength"},"depth":{"$ref":"#/$defs/positiveLength"},"widthSegments":{"$ref":"#/$defs/linearSegments"},"heightSegments":{"$ref":"#/$defs/linearSegments"},"depthSegments":{"$ref":"#/$defs/linearSegments"}}}}},"sphereGeometry":{"type":"object","additionalProperties":false,"required":["kind","parameters"],"properties":{"kind":{"const":"sphere"},"parameters":{"type":"object","additionalProperties":false,"required":["radius","widthSegments","heightSegments"],"properties":{"radius":{"$ref":"#/$defs/positiveLength"},"widthSegments":{"type":"integer","minimum":3,"maximum":256},"heightSegments":{"type":"integer","minimum":2,"maximum":256}}}}},"cylinderGeometry":{"type":"object","additionalProperties":false,"required":["kind","parameters"],"properties":{"kind":{"const":"cylinder"},"parameters":{"type":"object","additionalProperties":false,"required":["radiusTop","radiusBottom","height","radialSegments","heightSegments","openEnded"],"properties":{"radiusTop":{"$ref":"#/$defs/nonNegativeLength"},"radiusBottom":{"$ref":"#/$defs/nonNegativeLength"},"height":{"$ref":"#/$defs/positiveLength"},"radialSegments":{"$ref":"#/$defs/radialSegments"},"heightSegments":{"$ref":"#/$defs/linearSegments"},"openEnded":{"type":"boolean"}},"anyOf":[{"properties":{"radiusTop":{"type":"number","exclusiveMinimum":0}}},{"properties":{"radiusBottom":{"type":"number","exclusiveMinimum":0}}}]}}},"coneGeometry":{"type":"object","additionalProperties":false,"required":["kind","parameters"],"properties":{"kind":{"const":"cone"},"parameters":{"type":"object","additionalProperties":false,"required":["radius","height","radialSegments","heightSegments","openEnded"],"properties":{"radius":{"$ref":"#/$defs/positiveLength"},"height":{"$ref":"#/$defs/positiveLength"},"radialSegments":{"$ref":"#/$defs/radialSegments"},"heightSegments":{"$ref":"#/$defs/linearSegments"},"openEnded":{"type":"boolean"}}}}},"planeGeometry":{"type":"object","additionalProperties":false,"required":["kind","parameters"],"properties":{"kind":{"const":"plane"},"parameters":{"type":"object","additionalProperties":false,"required":["width","height","widthSegments","heightSegments"],"properties":{"width":{"$ref":"#/$defs/positiveLength"},"height":{"$ref":"#/$defs/positiveLength"},"widthSegments":{"$ref":"#/$defs/linearSegments"},"heightSegments":{"$ref":"#/$defs/linearSegments"}}}}},"torusGeometry":{"type":"object","additionalProperties":false,"required":["kind","parameters"],"properties":{"kind":{"const":"torus"},"parameters":{"type":"object","additionalProperties":false,"required":["radius","tube","radialSegments","tubularSegments","arc"],"properties":{"radius":{"$ref":"#/$defs/positiveLength"},"tube":{"$ref":"#/$defs/positiveLength"},"radialSegments":{"$ref":"#/$defs/radialSegments"},"tubularSegments":{"type":"integer","minimum":3,"maximum":512},"arc":{"type":"number","exclusiveMinimum":0,"maximum":6.283185307179586}}}}},"icosahedronGeometry":{"type":"object","additionalProperties":false,"required":["kind","parameters"],"properties":{"kind":{"const":"icosahedron"},"parameters":{"type":"object","additionalProperties":false,"required":["radius","detail"],"properties":{"radius":{"$ref":"#/$defs/positiveLength"},"detail":{"type":"integer","minimum":0,"maximum":5}}}}},"positiveLength":{"type":"number","exclusiveMinimum":0.000001,"maximum":10000},"nonNegativeLength":{"type":"number","minimum":0,"maximum":10000},"linearSegments":{"type":"integer","minimum":1,"maximum":64},"radialSegments":{"type":"integer","minimum":3,"maximum":256}}};
const schema32 = {"type":"object","additionalProperties":false,"required":["name","createdAt","updatedAt"],"properties":{"name":{"type":"string","minLength":1,"maxLength":120,"pattern":".*\\S.*"},"createdAt":{"type":"string","format":"date-time"},"updatedAt":{"type":"string","format":"date-time"}}};
import ucs2LengthModule from "ajv/dist/runtime/ucs2length.js";
const func1 = ucs2LengthModule.default ?? ucs2LengthModule;
const pattern4 = new RegExp("^[0-9]+\\.[0-9]+\\.[0-9]+(?:-[0-9A-Za-z.-]+)?$", "u");
const pattern5 = new RegExp(".*\\S.*", "u");
import formatsModule from "ajv-formats/dist/formats.js";
const formats0 = formatsModule.fullFormats["date-time"];
const schema33 = {"type":"object","additionalProperties":false,"required":["units","upAxis","assetFront","gridSize","backgroundColor"],"properties":{"units":{"type":"string","const":"meter"},"upAxis":{"type":"string","const":"Y"},"assetFront":{"type":"string","const":"+Z"},"gridSize":{"type":"number","minimum":0.001,"maximum":1000},"backgroundColor":{"$ref":"#/$defs/color"}}};
const schema34 = {"type":"string","pattern":"^#[0-9A-Fa-f]{6}$"};
const pattern6 = new RegExp("^#[0-9A-Fa-f]{6}$", "u");

function validate21(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate21.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.units === undefined){
const err0 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "units"},message:"must have required property '"+"units"+"'"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(data.upAxis === undefined){
const err1 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "upAxis"},message:"must have required property '"+"upAxis"+"'"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
if(data.assetFront === undefined){
const err2 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "assetFront"},message:"must have required property '"+"assetFront"+"'"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
if(data.gridSize === undefined){
const err3 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "gridSize"},message:"must have required property '"+"gridSize"+"'"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
if(data.backgroundColor === undefined){
const err4 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "backgroundColor"},message:"must have required property '"+"backgroundColor"+"'"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
for(const key0 in data){
if(!(((((key0 === "units") || (key0 === "upAxis")) || (key0 === "assetFront")) || (key0 === "gridSize")) || (key0 === "backgroundColor"))){
const err5 = {instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
}
if(data.units !== undefined){
let data0 = data.units;
if(typeof data0 !== "string"){
const err6 = {instancePath:instancePath+"/units",schemaPath:"#/properties/units/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
if("meter" !== data0){
const err7 = {instancePath:instancePath+"/units",schemaPath:"#/properties/units/const",keyword:"const",params:{allowedValue: "meter"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
}
if(data.upAxis !== undefined){
let data1 = data.upAxis;
if(typeof data1 !== "string"){
const err8 = {instancePath:instancePath+"/upAxis",schemaPath:"#/properties/upAxis/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
if("Y" !== data1){
const err9 = {instancePath:instancePath+"/upAxis",schemaPath:"#/properties/upAxis/const",keyword:"const",params:{allowedValue: "Y"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
}
if(data.assetFront !== undefined){
let data2 = data.assetFront;
if(typeof data2 !== "string"){
const err10 = {instancePath:instancePath+"/assetFront",schemaPath:"#/properties/assetFront/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
if("+Z" !== data2){
const err11 = {instancePath:instancePath+"/assetFront",schemaPath:"#/properties/assetFront/const",keyword:"const",params:{allowedValue: "+Z"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
}
if(data.gridSize !== undefined){
let data3 = data.gridSize;
if((typeof data3 == "number") && (isFinite(data3))){
if(data3 > 1000 || isNaN(data3)){
const err12 = {instancePath:instancePath+"/gridSize",schemaPath:"#/properties/gridSize/maximum",keyword:"maximum",params:{comparison: "<=", limit: 1000},message:"must be <= 1000"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
if(data3 < 0.001 || isNaN(data3)){
const err13 = {instancePath:instancePath+"/gridSize",schemaPath:"#/properties/gridSize/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0.001},message:"must be >= 0.001"};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
}
else {
const err14 = {instancePath:instancePath+"/gridSize",schemaPath:"#/properties/gridSize/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
}
}
if(data.backgroundColor !== undefined){
let data4 = data.backgroundColor;
if(typeof data4 === "string"){
if(!pattern6.test(data4)){
const err15 = {instancePath:instancePath+"/backgroundColor",schemaPath:"#/$defs/color/pattern",keyword:"pattern",params:{pattern: "^#[0-9A-Fa-f]{6}$"},message:"must match pattern \""+"^#[0-9A-Fa-f]{6}$"+"\""};
if(vErrors === null){
vErrors = [err15];
}
else {
vErrors.push(err15);
}
errors++;
}
}
else {
const err16 = {instancePath:instancePath+"/backgroundColor",schemaPath:"#/$defs/color/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err16];
}
else {
vErrors.push(err16);
}
errors++;
}
}
}
else {
const err17 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err17];
}
else {
vErrors.push(err17);
}
errors++;
}
validate21.errors = vErrors;
return errors === 0;
}
validate21.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

const schema35 = {"type":"object","additionalProperties":false,"required":["objects"],"properties":{"objects":{"type":"array","maxItems":5000,"items":{"$ref":"#/$defs/sceneObject"}}}};
const schema36 = {"oneOf":[{"$ref":"#/$defs/groupObject"},{"$ref":"#/$defs/meshObject"}]};
const schema37 = {"type":"object","allOf":[{"$ref":"#/$defs/baseObject"},{"type":"object","properties":{"type":{"const":"group"}}}],"unevaluatedProperties":false};
const schema38 = {"type":"object","required":["id","type","name","parentId","visible","locked","transform"],"properties":{"id":{"type":"string","format":"uuid"},"type":{"type":"string","enum":["group","mesh"]},"name":{"type":"string","minLength":1,"maxLength":120,"pattern":".*\\S.*"},"parentId":{"oneOf":[{"type":"null"},{"type":"string","format":"uuid"}]},"visible":{"type":"boolean"},"locked":{"type":"boolean"},"transform":{"$ref":"#/$defs/transform"},"editor":{"$ref":"#/$defs/editorMetadata"}}};
const schema52 = {"type":"object","additionalProperties":false,"required":["templateRole"],"properties":{"templateRole":{"type":"string","enum":["none","root","part"]},"templateId":{"type":"string","minLength":1,"maxLength":64,"pattern":"^[a-z0-9]+(?:[.-][a-z0-9]+)*$"},"templateVersion":{"type":"string","minLength":1,"maxLength":40,"pattern":"^[0-9]+\\.[0-9]+\\.[0-9]+(?:-[0-9A-Za-z.-]+)?$"},"templateRootId":{"oneOf":[{"type":"null"},{"type":"string","format":"uuid"}]}}};
const formats4 = /^(?:urn:uuid:)?[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i;
const pattern8 = new RegExp("^[a-z0-9]+(?:[.-][a-z0-9]+)*$", "u");
const schema39 = {"type":"object","additionalProperties":false,"required":["position","rotation","scale"],"properties":{"position":{"$ref":"#/$defs/position"},"rotation":{"$ref":"#/$defs/rotation"},"scale":{"$ref":"#/$defs/scale"}}};
const schema40 = {"type":"array","minItems":3,"maxItems":3,"prefixItems":[{"$ref":"#/$defs/signedCoordinate"},{"$ref":"#/$defs/signedCoordinate"},{"$ref":"#/$defs/signedCoordinate"}],"items":false};
const schema41 = {"type":"number","minimum":-1000000,"maximum":1000000};

function validate28(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate28.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(Array.isArray(data)){
if(data.length > 3){
const err0 = {instancePath,schemaPath:"#/maxItems",keyword:"maxItems",params:{limit: 3},message:"must NOT have more than 3 items"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(data.length < 3){
const err1 = {instancePath,schemaPath:"#/minItems",keyword:"minItems",params:{limit: 3},message:"must NOT have fewer than 3 items"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
const len0 = data.length;
if(len0 > 0){
let data0 = data[0];
if((typeof data0 == "number") && (isFinite(data0))){
if(data0 > 1000000 || isNaN(data0)){
const err2 = {instancePath:instancePath+"/0",schemaPath:"#/$defs/signedCoordinate/maximum",keyword:"maximum",params:{comparison: "<=", limit: 1000000},message:"must be <= 1000000"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
if(data0 < -1000000 || isNaN(data0)){
const err3 = {instancePath:instancePath+"/0",schemaPath:"#/$defs/signedCoordinate/minimum",keyword:"minimum",params:{comparison: ">=", limit: -1000000},message:"must be >= -1000000"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
}
else {
const err4 = {instancePath:instancePath+"/0",schemaPath:"#/$defs/signedCoordinate/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
}
if(len0 > 1){
let data1 = data[1];
if((typeof data1 == "number") && (isFinite(data1))){
if(data1 > 1000000 || isNaN(data1)){
const err5 = {instancePath:instancePath+"/1",schemaPath:"#/$defs/signedCoordinate/maximum",keyword:"maximum",params:{comparison: "<=", limit: 1000000},message:"must be <= 1000000"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
if(data1 < -1000000 || isNaN(data1)){
const err6 = {instancePath:instancePath+"/1",schemaPath:"#/$defs/signedCoordinate/minimum",keyword:"minimum",params:{comparison: ">=", limit: -1000000},message:"must be >= -1000000"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
}
else {
const err7 = {instancePath:instancePath+"/1",schemaPath:"#/$defs/signedCoordinate/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
}
if(len0 > 2){
let data2 = data[2];
if((typeof data2 == "number") && (isFinite(data2))){
if(data2 > 1000000 || isNaN(data2)){
const err8 = {instancePath:instancePath+"/2",schemaPath:"#/$defs/signedCoordinate/maximum",keyword:"maximum",params:{comparison: "<=", limit: 1000000},message:"must be <= 1000000"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
if(data2 < -1000000 || isNaN(data2)){
const err9 = {instancePath:instancePath+"/2",schemaPath:"#/$defs/signedCoordinate/minimum",keyword:"minimum",params:{comparison: ">=", limit: -1000000},message:"must be >= -1000000"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
}
else {
const err10 = {instancePath:instancePath+"/2",schemaPath:"#/$defs/signedCoordinate/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
}
const len1 = data.length;
if(!(len1 <= 3)){
const err11 = {instancePath,schemaPath:"#/items",keyword:"items",params:{limit: 3},message:"must NOT have more than 3 items"};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
}
else {
const err12 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
validate28.errors = vErrors;
return errors === 0;
}
validate28.evaluated = {"items":true,"dynamicProps":false,"dynamicItems":false};

const schema44 = {"type":"object","additionalProperties":false,"required":["order","radians"],"properties":{"order":{"type":"string","const":"XYZ"},"radians":{"type":"array","minItems":3,"maxItems":3,"prefixItems":[{"$ref":"#/$defs/signedAngle"},{"$ref":"#/$defs/signedAngle"},{"$ref":"#/$defs/signedAngle"}],"items":false}}};
const schema45 = {"type":"number","minimum":-1000000,"maximum":1000000};

function validate30(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate30.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.order === undefined){
const err0 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "order"},message:"must have required property '"+"order"+"'"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(data.radians === undefined){
const err1 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "radians"},message:"must have required property '"+"radians"+"'"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
for(const key0 in data){
if(!((key0 === "order") || (key0 === "radians"))){
const err2 = {instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
}
if(data.order !== undefined){
let data0 = data.order;
if(typeof data0 !== "string"){
const err3 = {instancePath:instancePath+"/order",schemaPath:"#/properties/order/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
if("XYZ" !== data0){
const err4 = {instancePath:instancePath+"/order",schemaPath:"#/properties/order/const",keyword:"const",params:{allowedValue: "XYZ"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
}
if(data.radians !== undefined){
let data1 = data.radians;
if(Array.isArray(data1)){
if(data1.length > 3){
const err5 = {instancePath:instancePath+"/radians",schemaPath:"#/properties/radians/maxItems",keyword:"maxItems",params:{limit: 3},message:"must NOT have more than 3 items"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
if(data1.length < 3){
const err6 = {instancePath:instancePath+"/radians",schemaPath:"#/properties/radians/minItems",keyword:"minItems",params:{limit: 3},message:"must NOT have fewer than 3 items"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
const len0 = data1.length;
if(len0 > 0){
let data2 = data1[0];
if((typeof data2 == "number") && (isFinite(data2))){
if(data2 > 1000000 || isNaN(data2)){
const err7 = {instancePath:instancePath+"/radians/0",schemaPath:"#/$defs/signedAngle/maximum",keyword:"maximum",params:{comparison: "<=", limit: 1000000},message:"must be <= 1000000"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
if(data2 < -1000000 || isNaN(data2)){
const err8 = {instancePath:instancePath+"/radians/0",schemaPath:"#/$defs/signedAngle/minimum",keyword:"minimum",params:{comparison: ">=", limit: -1000000},message:"must be >= -1000000"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
}
else {
const err9 = {instancePath:instancePath+"/radians/0",schemaPath:"#/$defs/signedAngle/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
}
if(len0 > 1){
let data3 = data1[1];
if((typeof data3 == "number") && (isFinite(data3))){
if(data3 > 1000000 || isNaN(data3)){
const err10 = {instancePath:instancePath+"/radians/1",schemaPath:"#/$defs/signedAngle/maximum",keyword:"maximum",params:{comparison: "<=", limit: 1000000},message:"must be <= 1000000"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
if(data3 < -1000000 || isNaN(data3)){
const err11 = {instancePath:instancePath+"/radians/1",schemaPath:"#/$defs/signedAngle/minimum",keyword:"minimum",params:{comparison: ">=", limit: -1000000},message:"must be >= -1000000"};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
}
else {
const err12 = {instancePath:instancePath+"/radians/1",schemaPath:"#/$defs/signedAngle/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
}
if(len0 > 2){
let data4 = data1[2];
if((typeof data4 == "number") && (isFinite(data4))){
if(data4 > 1000000 || isNaN(data4)){
const err13 = {instancePath:instancePath+"/radians/2",schemaPath:"#/$defs/signedAngle/maximum",keyword:"maximum",params:{comparison: "<=", limit: 1000000},message:"must be <= 1000000"};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
if(data4 < -1000000 || isNaN(data4)){
const err14 = {instancePath:instancePath+"/radians/2",schemaPath:"#/$defs/signedAngle/minimum",keyword:"minimum",params:{comparison: ">=", limit: -1000000},message:"must be >= -1000000"};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
}
}
else {
const err15 = {instancePath:instancePath+"/radians/2",schemaPath:"#/$defs/signedAngle/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err15];
}
else {
vErrors.push(err15);
}
errors++;
}
}
const len1 = data1.length;
if(!(len1 <= 3)){
const err16 = {instancePath:instancePath+"/radians",schemaPath:"#/properties/radians/items",keyword:"items",params:{limit: 3},message:"must NOT have more than 3 items"};
if(vErrors === null){
vErrors = [err16];
}
else {
vErrors.push(err16);
}
errors++;
}
}
else {
const err17 = {instancePath:instancePath+"/radians",schemaPath:"#/properties/radians/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err17];
}
else {
vErrors.push(err17);
}
errors++;
}
}
}
else {
const err18 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err18];
}
else {
vErrors.push(err18);
}
errors++;
}
validate30.errors = vErrors;
return errors === 0;
}
validate30.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

const schema48 = {"type":"array","minItems":3,"maxItems":3,"prefixItems":[{"$ref":"#/$defs/positiveScale"},{"$ref":"#/$defs/positiveScale"},{"$ref":"#/$defs/positiveScale"}],"items":false};
const schema49 = {"type":"number","exclusiveMinimum":0.000001,"maximum":10000};

function validate32(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate32.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(Array.isArray(data)){
if(data.length > 3){
const err0 = {instancePath,schemaPath:"#/maxItems",keyword:"maxItems",params:{limit: 3},message:"must NOT have more than 3 items"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(data.length < 3){
const err1 = {instancePath,schemaPath:"#/minItems",keyword:"minItems",params:{limit: 3},message:"must NOT have fewer than 3 items"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
const len0 = data.length;
if(len0 > 0){
let data0 = data[0];
if((typeof data0 == "number") && (isFinite(data0))){
if(data0 > 10000 || isNaN(data0)){
const err2 = {instancePath:instancePath+"/0",schemaPath:"#/$defs/positiveScale/maximum",keyword:"maximum",params:{comparison: "<=", limit: 10000},message:"must be <= 10000"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
if(data0 <= 0.000001 || isNaN(data0)){
const err3 = {instancePath:instancePath+"/0",schemaPath:"#/$defs/positiveScale/exclusiveMinimum",keyword:"exclusiveMinimum",params:{comparison: ">", limit: 0.000001},message:"must be > 0.000001"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
}
else {
const err4 = {instancePath:instancePath+"/0",schemaPath:"#/$defs/positiveScale/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
}
if(len0 > 1){
let data1 = data[1];
if((typeof data1 == "number") && (isFinite(data1))){
if(data1 > 10000 || isNaN(data1)){
const err5 = {instancePath:instancePath+"/1",schemaPath:"#/$defs/positiveScale/maximum",keyword:"maximum",params:{comparison: "<=", limit: 10000},message:"must be <= 10000"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
if(data1 <= 0.000001 || isNaN(data1)){
const err6 = {instancePath:instancePath+"/1",schemaPath:"#/$defs/positiveScale/exclusiveMinimum",keyword:"exclusiveMinimum",params:{comparison: ">", limit: 0.000001},message:"must be > 0.000001"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
}
else {
const err7 = {instancePath:instancePath+"/1",schemaPath:"#/$defs/positiveScale/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
}
if(len0 > 2){
let data2 = data[2];
if((typeof data2 == "number") && (isFinite(data2))){
if(data2 > 10000 || isNaN(data2)){
const err8 = {instancePath:instancePath+"/2",schemaPath:"#/$defs/positiveScale/maximum",keyword:"maximum",params:{comparison: "<=", limit: 10000},message:"must be <= 10000"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
if(data2 <= 0.000001 || isNaN(data2)){
const err9 = {instancePath:instancePath+"/2",schemaPath:"#/$defs/positiveScale/exclusiveMinimum",keyword:"exclusiveMinimum",params:{comparison: ">", limit: 0.000001},message:"must be > 0.000001"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
}
else {
const err10 = {instancePath:instancePath+"/2",schemaPath:"#/$defs/positiveScale/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
}
const len1 = data.length;
if(!(len1 <= 3)){
const err11 = {instancePath,schemaPath:"#/items",keyword:"items",params:{limit: 3},message:"must NOT have more than 3 items"};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
}
else {
const err12 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
validate32.errors = vErrors;
return errors === 0;
}
validate32.evaluated = {"items":true,"dynamicProps":false,"dynamicItems":false};


function validate27(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate27.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.position === undefined){
const err0 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "position"},message:"must have required property '"+"position"+"'"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(data.rotation === undefined){
const err1 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "rotation"},message:"must have required property '"+"rotation"+"'"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
if(data.scale === undefined){
const err2 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "scale"},message:"must have required property '"+"scale"+"'"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
for(const key0 in data){
if(!(((key0 === "position") || (key0 === "rotation")) || (key0 === "scale"))){
const err3 = {instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
}
if(data.position !== undefined){
if(!(validate28(data.position, {instancePath:instancePath+"/position",parentData:data,parentDataProperty:"position",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate28.errors : vErrors.concat(validate28.errors);
errors = vErrors.length;
}
}
if(data.rotation !== undefined){
if(!(validate30(data.rotation, {instancePath:instancePath+"/rotation",parentData:data,parentDataProperty:"rotation",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate30.errors : vErrors.concat(validate30.errors);
errors = vErrors.length;
}
}
if(data.scale !== undefined){
if(!(validate32(data.scale, {instancePath:instancePath+"/scale",parentData:data,parentDataProperty:"scale",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate32.errors : vErrors.concat(validate32.errors);
errors = vErrors.length;
}
}
}
else {
const err4 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
validate27.errors = vErrors;
return errors === 0;
}
validate27.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};


function validate26(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate26.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.id === undefined){
const err0 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "id"},message:"must have required property '"+"id"+"'"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(data.type === undefined){
const err1 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "type"},message:"must have required property '"+"type"+"'"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
if(data.name === undefined){
const err2 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "name"},message:"must have required property '"+"name"+"'"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
if(data.parentId === undefined){
const err3 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "parentId"},message:"must have required property '"+"parentId"+"'"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
if(data.visible === undefined){
const err4 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "visible"},message:"must have required property '"+"visible"+"'"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
if(data.locked === undefined){
const err5 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "locked"},message:"must have required property '"+"locked"+"'"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
if(data.transform === undefined){
const err6 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "transform"},message:"must have required property '"+"transform"+"'"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
if(data.id !== undefined){
let data0 = data.id;
if(typeof data0 === "string"){
if(!(formats4.test(data0))){
const err7 = {instancePath:instancePath+"/id",schemaPath:"#/properties/id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
}
else {
const err8 = {instancePath:instancePath+"/id",schemaPath:"#/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
}
if(data.type !== undefined){
let data1 = data.type;
if(typeof data1 !== "string"){
const err9 = {instancePath:instancePath+"/type",schemaPath:"#/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
if(!((data1 === "group") || (data1 === "mesh"))){
const err10 = {instancePath:instancePath+"/type",schemaPath:"#/properties/type/enum",keyword:"enum",params:{allowedValues: schema38.properties.type.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
}
if(data.name !== undefined){
let data2 = data.name;
if(typeof data2 === "string"){
if(func1(data2) > 120){
const err11 = {instancePath:instancePath+"/name",schemaPath:"#/properties/name/maxLength",keyword:"maxLength",params:{limit: 120},message:"must NOT have more than 120 characters"};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
if(func1(data2) < 1){
const err12 = {instancePath:instancePath+"/name",schemaPath:"#/properties/name/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
if(!pattern5.test(data2)){
const err13 = {instancePath:instancePath+"/name",schemaPath:"#/properties/name/pattern",keyword:"pattern",params:{pattern: ".*\\S.*"},message:"must match pattern \""+".*\\S.*"+"\""};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
}
else {
const err14 = {instancePath:instancePath+"/name",schemaPath:"#/properties/name/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
}
}
if(data.parentId !== undefined){
let data3 = data.parentId;
const _errs8 = errors;
let valid1 = false;
let passing0 = null;
const _errs9 = errors;
if(data3 !== null){
const err15 = {instancePath:instancePath+"/parentId",schemaPath:"#/properties/parentId/oneOf/0/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err15];
}
else {
vErrors.push(err15);
}
errors++;
}
var _valid0 = _errs9 === errors;
if(_valid0){
valid1 = true;
passing0 = 0;
}
const _errs11 = errors;
if(typeof data3 === "string"){
if(!(formats4.test(data3))){
const err16 = {instancePath:instancePath+"/parentId",schemaPath:"#/properties/parentId/oneOf/1/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};
if(vErrors === null){
vErrors = [err16];
}
else {
vErrors.push(err16);
}
errors++;
}
}
else {
const err17 = {instancePath:instancePath+"/parentId",schemaPath:"#/properties/parentId/oneOf/1/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err17];
}
else {
vErrors.push(err17);
}
errors++;
}
var _valid0 = _errs11 === errors;
if(_valid0 && valid1){
valid1 = false;
passing0 = [passing0, 1];
}
else {
if(_valid0){
valid1 = true;
passing0 = 1;
}
}
if(!valid1){
const err18 = {instancePath:instancePath+"/parentId",schemaPath:"#/properties/parentId/oneOf",keyword:"oneOf",params:{passingSchemas: passing0},message:"must match exactly one schema in oneOf"};
if(vErrors === null){
vErrors = [err18];
}
else {
vErrors.push(err18);
}
errors++;
}
else {
errors = _errs8;
if(vErrors !== null){
if(_errs8){
vErrors.length = _errs8;
}
else {
vErrors = null;
}
}
}
}
if(data.visible !== undefined){
if(typeof data.visible !== "boolean"){
const err19 = {instancePath:instancePath+"/visible",schemaPath:"#/properties/visible/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};
if(vErrors === null){
vErrors = [err19];
}
else {
vErrors.push(err19);
}
errors++;
}
}
if(data.locked !== undefined){
if(typeof data.locked !== "boolean"){
const err20 = {instancePath:instancePath+"/locked",schemaPath:"#/properties/locked/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};
if(vErrors === null){
vErrors = [err20];
}
else {
vErrors.push(err20);
}
errors++;
}
}
if(data.transform !== undefined){
if(!(validate27(data.transform, {instancePath:instancePath+"/transform",parentData:data,parentDataProperty:"transform",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate27.errors : vErrors.concat(validate27.errors);
errors = vErrors.length;
}
}
if(data.editor !== undefined){
let data7 = data.editor;
if(data7 && typeof data7 == "object" && !Array.isArray(data7)){
if(data7.templateRole === undefined){
const err21 = {instancePath:instancePath+"/editor",schemaPath:"#/$defs/editorMetadata/required",keyword:"required",params:{missingProperty: "templateRole"},message:"must have required property '"+"templateRole"+"'"};
if(vErrors === null){
vErrors = [err21];
}
else {
vErrors.push(err21);
}
errors++;
}
for(const key0 in data7){
if(!((((key0 === "templateRole") || (key0 === "templateId")) || (key0 === "templateVersion")) || (key0 === "templateRootId"))){
const err22 = {instancePath:instancePath+"/editor",schemaPath:"#/$defs/editorMetadata/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err22];
}
else {
vErrors.push(err22);
}
errors++;
}
}
if(data7.templateRole !== undefined){
let data8 = data7.templateRole;
if(typeof data8 !== "string"){
const err23 = {instancePath:instancePath+"/editor/templateRole",schemaPath:"#/$defs/editorMetadata/properties/templateRole/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err23];
}
else {
vErrors.push(err23);
}
errors++;
}
if(!(((data8 === "none") || (data8 === "root")) || (data8 === "part"))){
const err24 = {instancePath:instancePath+"/editor/templateRole",schemaPath:"#/$defs/editorMetadata/properties/templateRole/enum",keyword:"enum",params:{allowedValues: schema52.properties.templateRole.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err24];
}
else {
vErrors.push(err24);
}
errors++;
}
}
if(data7.templateId !== undefined){
let data9 = data7.templateId;
if(typeof data9 === "string"){
if(func1(data9) > 64){
const err25 = {instancePath:instancePath+"/editor/templateId",schemaPath:"#/$defs/editorMetadata/properties/templateId/maxLength",keyword:"maxLength",params:{limit: 64},message:"must NOT have more than 64 characters"};
if(vErrors === null){
vErrors = [err25];
}
else {
vErrors.push(err25);
}
errors++;
}
if(func1(data9) < 1){
const err26 = {instancePath:instancePath+"/editor/templateId",schemaPath:"#/$defs/editorMetadata/properties/templateId/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err26];
}
else {
vErrors.push(err26);
}
errors++;
}
if(!pattern8.test(data9)){
const err27 = {instancePath:instancePath+"/editor/templateId",schemaPath:"#/$defs/editorMetadata/properties/templateId/pattern",keyword:"pattern",params:{pattern: "^[a-z0-9]+(?:[.-][a-z0-9]+)*$"},message:"must match pattern \""+"^[a-z0-9]+(?:[.-][a-z0-9]+)*$"+"\""};
if(vErrors === null){
vErrors = [err27];
}
else {
vErrors.push(err27);
}
errors++;
}
}
else {
const err28 = {instancePath:instancePath+"/editor/templateId",schemaPath:"#/$defs/editorMetadata/properties/templateId/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err28];
}
else {
vErrors.push(err28);
}
errors++;
}
}
if(data7.templateVersion !== undefined){
let data10 = data7.templateVersion;
if(typeof data10 === "string"){
if(func1(data10) > 40){
const err29 = {instancePath:instancePath+"/editor/templateVersion",schemaPath:"#/$defs/editorMetadata/properties/templateVersion/maxLength",keyword:"maxLength",params:{limit: 40},message:"must NOT have more than 40 characters"};
if(vErrors === null){
vErrors = [err29];
}
else {
vErrors.push(err29);
}
errors++;
}
if(func1(data10) < 1){
const err30 = {instancePath:instancePath+"/editor/templateVersion",schemaPath:"#/$defs/editorMetadata/properties/templateVersion/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err30];
}
else {
vErrors.push(err30);
}
errors++;
}
if(!pattern4.test(data10)){
const err31 = {instancePath:instancePath+"/editor/templateVersion",schemaPath:"#/$defs/editorMetadata/properties/templateVersion/pattern",keyword:"pattern",params:{pattern: "^[0-9]+\\.[0-9]+\\.[0-9]+(?:-[0-9A-Za-z.-]+)?$"},message:"must match pattern \""+"^[0-9]+\\.[0-9]+\\.[0-9]+(?:-[0-9A-Za-z.-]+)?$"+"\""};
if(vErrors === null){
vErrors = [err31];
}
else {
vErrors.push(err31);
}
errors++;
}
}
else {
const err32 = {instancePath:instancePath+"/editor/templateVersion",schemaPath:"#/$defs/editorMetadata/properties/templateVersion/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err32];
}
else {
vErrors.push(err32);
}
errors++;
}
}
if(data7.templateRootId !== undefined){
let data11 = data7.templateRootId;
const _errs29 = errors;
let valid4 = false;
let passing1 = null;
const _errs30 = errors;
if(data11 !== null){
const err33 = {instancePath:instancePath+"/editor/templateRootId",schemaPath:"#/$defs/editorMetadata/properties/templateRootId/oneOf/0/type",keyword:"type",params:{type: "null"},message:"must be null"};
if(vErrors === null){
vErrors = [err33];
}
else {
vErrors.push(err33);
}
errors++;
}
var _valid1 = _errs30 === errors;
if(_valid1){
valid4 = true;
passing1 = 0;
}
const _errs32 = errors;
if(typeof data11 === "string"){
if(!(formats4.test(data11))){
const err34 = {instancePath:instancePath+"/editor/templateRootId",schemaPath:"#/$defs/editorMetadata/properties/templateRootId/oneOf/1/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""};
if(vErrors === null){
vErrors = [err34];
}
else {
vErrors.push(err34);
}
errors++;
}
}
else {
const err35 = {instancePath:instancePath+"/editor/templateRootId",schemaPath:"#/$defs/editorMetadata/properties/templateRootId/oneOf/1/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err35];
}
else {
vErrors.push(err35);
}
errors++;
}
var _valid1 = _errs32 === errors;
if(_valid1 && valid4){
valid4 = false;
passing1 = [passing1, 1];
}
else {
if(_valid1){
valid4 = true;
passing1 = 1;
}
}
if(!valid4){
const err36 = {instancePath:instancePath+"/editor/templateRootId",schemaPath:"#/$defs/editorMetadata/properties/templateRootId/oneOf",keyword:"oneOf",params:{passingSchemas: passing1},message:"must match exactly one schema in oneOf"};
if(vErrors === null){
vErrors = [err36];
}
else {
vErrors.push(err36);
}
errors++;
}
else {
errors = _errs29;
if(vErrors !== null){
if(_errs29){
vErrors.length = _errs29;
}
else {
vErrors = null;
}
}
}
}
}
else {
const err37 = {instancePath:instancePath+"/editor",schemaPath:"#/$defs/editorMetadata/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err37];
}
else {
vErrors.push(err37);
}
errors++;
}
}
}
else {
const err38 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err38];
}
else {
vErrors.push(err38);
}
errors++;
}
validate26.errors = vErrors;
return errors === 0;
}
validate26.evaluated = {"props":{"id":true,"type":true,"name":true,"parentId":true,"visible":true,"locked":true,"transform":true,"editor":true},"dynamicProps":false,"dynamicItems":false};


function validate25(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate25.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(!(validate26(data, {instancePath,parentData,parentDataProperty,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate26.errors : vErrors.concat(validate26.errors);
errors = vErrors.length;
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.type !== undefined){
if("group" !== data.type){
const err0 = {instancePath:instancePath+"/type",schemaPath:"#/allOf/1/properties/type/const",keyword:"const",params:{allowedValue: "group"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
}
}
else {
const err1 = {instancePath,schemaPath:"#/allOf/1/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
if(data && typeof data == "object" && !Array.isArray(data)){
for(const key0 in data){
if((((((((key0 !== "type") && (key0 !== "id")) && (key0 !== "name")) && (key0 !== "parentId")) && (key0 !== "visible")) && (key0 !== "locked")) && (key0 !== "transform")) && (key0 !== "editor")){
const err2 = {instancePath,schemaPath:"#/unevaluatedProperties",keyword:"unevaluatedProperties",params:{unevaluatedProperty: key0},message:"must NOT have unevaluated properties"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
}
}
else {
const err3 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
validate25.errors = vErrors;
return errors === 0;
}
validate25.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

const schema53 = {"type":"object","allOf":[{"$ref":"#/$defs/baseObject"},{"type":"object","required":["geometry","material"],"properties":{"type":{"const":"mesh"},"geometry":{"$ref":"#/$defs/geometry"},"material":{"$ref":"#/$defs/material"}}}],"unevaluatedProperties":false};
const schema54 = {"oneOf":[{"$ref":"#/$defs/boxGeometry"},{"$ref":"#/$defs/sphereGeometry"},{"$ref":"#/$defs/cylinderGeometry"},{"$ref":"#/$defs/coneGeometry"},{"$ref":"#/$defs/planeGeometry"},{"$ref":"#/$defs/torusGeometry"},{"$ref":"#/$defs/icosahedronGeometry"}]};
const schema55 = {"type":"object","additionalProperties":false,"required":["kind","parameters"],"properties":{"kind":{"const":"box"},"parameters":{"type":"object","additionalProperties":false,"required":["width","height","depth","widthSegments","heightSegments","depthSegments"],"properties":{"width":{"$ref":"#/$defs/positiveLength"},"height":{"$ref":"#/$defs/positiveLength"},"depth":{"$ref":"#/$defs/positiveLength"},"widthSegments":{"$ref":"#/$defs/linearSegments"},"heightSegments":{"$ref":"#/$defs/linearSegments"},"depthSegments":{"$ref":"#/$defs/linearSegments"}}}}};
const schema56 = {"type":"number","exclusiveMinimum":0.000001,"maximum":10000};
const schema59 = {"type":"integer","minimum":1,"maximum":64};

function validate40(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate40.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.kind === undefined){
const err0 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "kind"},message:"must have required property '"+"kind"+"'"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(data.parameters === undefined){
const err1 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "parameters"},message:"must have required property '"+"parameters"+"'"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
for(const key0 in data){
if(!((key0 === "kind") || (key0 === "parameters"))){
const err2 = {instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
}
if(data.kind !== undefined){
if("box" !== data.kind){
const err3 = {instancePath:instancePath+"/kind",schemaPath:"#/properties/kind/const",keyword:"const",params:{allowedValue: "box"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
}
if(data.parameters !== undefined){
let data1 = data.parameters;
if(data1 && typeof data1 == "object" && !Array.isArray(data1)){
if(data1.width === undefined){
const err4 = {instancePath:instancePath+"/parameters",schemaPath:"#/properties/parameters/required",keyword:"required",params:{missingProperty: "width"},message:"must have required property '"+"width"+"'"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
if(data1.height === undefined){
const err5 = {instancePath:instancePath+"/parameters",schemaPath:"#/properties/parameters/required",keyword:"required",params:{missingProperty: "height"},message:"must have required property '"+"height"+"'"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
if(data1.depth === undefined){
const err6 = {instancePath:instancePath+"/parameters",schemaPath:"#/properties/parameters/required",keyword:"required",params:{missingProperty: "depth"},message:"must have required property '"+"depth"+"'"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
if(data1.widthSegments === undefined){
const err7 = {instancePath:instancePath+"/parameters",schemaPath:"#/properties/parameters/required",keyword:"required",params:{missingProperty: "widthSegments"},message:"must have required property '"+"widthSegments"+"'"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
if(data1.heightSegments === undefined){
const err8 = {instancePath:instancePath+"/parameters",schemaPath:"#/properties/parameters/required",keyword:"required",params:{missingProperty: "heightSegments"},message:"must have required property '"+"heightSegments"+"'"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
if(data1.depthSegments === undefined){
const err9 = {instancePath:instancePath+"/parameters",schemaPath:"#/properties/parameters/required",keyword:"required",params:{missingProperty: "depthSegments"},message:"must have required property '"+"depthSegments"+"'"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
for(const key1 in data1){
if(!((((((key1 === "width") || (key1 === "height")) || (key1 === "depth")) || (key1 === "widthSegments")) || (key1 === "heightSegments")) || (key1 === "depthSegments"))){
const err10 = {instancePath:instancePath+"/parameters",schemaPath:"#/properties/parameters/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key1},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
}
if(data1.width !== undefined){
let data2 = data1.width;
if((typeof data2 == "number") && (isFinite(data2))){
if(data2 > 10000 || isNaN(data2)){
const err11 = {instancePath:instancePath+"/parameters/width",schemaPath:"#/$defs/positiveLength/maximum",keyword:"maximum",params:{comparison: "<=", limit: 10000},message:"must be <= 10000"};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
if(data2 <= 0.000001 || isNaN(data2)){
const err12 = {instancePath:instancePath+"/parameters/width",schemaPath:"#/$defs/positiveLength/exclusiveMinimum",keyword:"exclusiveMinimum",params:{comparison: ">", limit: 0.000001},message:"must be > 0.000001"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
}
else {
const err13 = {instancePath:instancePath+"/parameters/width",schemaPath:"#/$defs/positiveLength/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
}
if(data1.height !== undefined){
let data3 = data1.height;
if((typeof data3 == "number") && (isFinite(data3))){
if(data3 > 10000 || isNaN(data3)){
const err14 = {instancePath:instancePath+"/parameters/height",schemaPath:"#/$defs/positiveLength/maximum",keyword:"maximum",params:{comparison: "<=", limit: 10000},message:"must be <= 10000"};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
}
if(data3 <= 0.000001 || isNaN(data3)){
const err15 = {instancePath:instancePath+"/parameters/height",schemaPath:"#/$defs/positiveLength/exclusiveMinimum",keyword:"exclusiveMinimum",params:{comparison: ">", limit: 0.000001},message:"must be > 0.000001"};
if(vErrors === null){
vErrors = [err15];
}
else {
vErrors.push(err15);
}
errors++;
}
}
else {
const err16 = {instancePath:instancePath+"/parameters/height",schemaPath:"#/$defs/positiveLength/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err16];
}
else {
vErrors.push(err16);
}
errors++;
}
}
if(data1.depth !== undefined){
let data4 = data1.depth;
if((typeof data4 == "number") && (isFinite(data4))){
if(data4 > 10000 || isNaN(data4)){
const err17 = {instancePath:instancePath+"/parameters/depth",schemaPath:"#/$defs/positiveLength/maximum",keyword:"maximum",params:{comparison: "<=", limit: 10000},message:"must be <= 10000"};
if(vErrors === null){
vErrors = [err17];
}
else {
vErrors.push(err17);
}
errors++;
}
if(data4 <= 0.000001 || isNaN(data4)){
const err18 = {instancePath:instancePath+"/parameters/depth",schemaPath:"#/$defs/positiveLength/exclusiveMinimum",keyword:"exclusiveMinimum",params:{comparison: ">", limit: 0.000001},message:"must be > 0.000001"};
if(vErrors === null){
vErrors = [err18];
}
else {
vErrors.push(err18);
}
errors++;
}
}
else {
const err19 = {instancePath:instancePath+"/parameters/depth",schemaPath:"#/$defs/positiveLength/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err19];
}
else {
vErrors.push(err19);
}
errors++;
}
}
if(data1.widthSegments !== undefined){
let data5 = data1.widthSegments;
if(!(((typeof data5 == "number") && (!(data5 % 1) && !isNaN(data5))) && (isFinite(data5)))){
const err20 = {instancePath:instancePath+"/parameters/widthSegments",schemaPath:"#/$defs/linearSegments/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err20];
}
else {
vErrors.push(err20);
}
errors++;
}
if((typeof data5 == "number") && (isFinite(data5))){
if(data5 > 64 || isNaN(data5)){
const err21 = {instancePath:instancePath+"/parameters/widthSegments",schemaPath:"#/$defs/linearSegments/maximum",keyword:"maximum",params:{comparison: "<=", limit: 64},message:"must be <= 64"};
if(vErrors === null){
vErrors = [err21];
}
else {
vErrors.push(err21);
}
errors++;
}
if(data5 < 1 || isNaN(data5)){
const err22 = {instancePath:instancePath+"/parameters/widthSegments",schemaPath:"#/$defs/linearSegments/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"};
if(vErrors === null){
vErrors = [err22];
}
else {
vErrors.push(err22);
}
errors++;
}
}
}
if(data1.heightSegments !== undefined){
let data6 = data1.heightSegments;
if(!(((typeof data6 == "number") && (!(data6 % 1) && !isNaN(data6))) && (isFinite(data6)))){
const err23 = {instancePath:instancePath+"/parameters/heightSegments",schemaPath:"#/$defs/linearSegments/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err23];
}
else {
vErrors.push(err23);
}
errors++;
}
if((typeof data6 == "number") && (isFinite(data6))){
if(data6 > 64 || isNaN(data6)){
const err24 = {instancePath:instancePath+"/parameters/heightSegments",schemaPath:"#/$defs/linearSegments/maximum",keyword:"maximum",params:{comparison: "<=", limit: 64},message:"must be <= 64"};
if(vErrors === null){
vErrors = [err24];
}
else {
vErrors.push(err24);
}
errors++;
}
if(data6 < 1 || isNaN(data6)){
const err25 = {instancePath:instancePath+"/parameters/heightSegments",schemaPath:"#/$defs/linearSegments/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"};
if(vErrors === null){
vErrors = [err25];
}
else {
vErrors.push(err25);
}
errors++;
}
}
}
if(data1.depthSegments !== undefined){
let data7 = data1.depthSegments;
if(!(((typeof data7 == "number") && (!(data7 % 1) && !isNaN(data7))) && (isFinite(data7)))){
const err26 = {instancePath:instancePath+"/parameters/depthSegments",schemaPath:"#/$defs/linearSegments/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err26];
}
else {
vErrors.push(err26);
}
errors++;
}
if((typeof data7 == "number") && (isFinite(data7))){
if(data7 > 64 || isNaN(data7)){
const err27 = {instancePath:instancePath+"/parameters/depthSegments",schemaPath:"#/$defs/linearSegments/maximum",keyword:"maximum",params:{comparison: "<=", limit: 64},message:"must be <= 64"};
if(vErrors === null){
vErrors = [err27];
}
else {
vErrors.push(err27);
}
errors++;
}
if(data7 < 1 || isNaN(data7)){
const err28 = {instancePath:instancePath+"/parameters/depthSegments",schemaPath:"#/$defs/linearSegments/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"};
if(vErrors === null){
vErrors = [err28];
}
else {
vErrors.push(err28);
}
errors++;
}
}
}
}
else {
const err29 = {instancePath:instancePath+"/parameters",schemaPath:"#/properties/parameters/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err29];
}
else {
vErrors.push(err29);
}
errors++;
}
}
}
else {
const err30 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err30];
}
else {
vErrors.push(err30);
}
errors++;
}
validate40.errors = vErrors;
return errors === 0;
}
validate40.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

const schema62 = {"type":"object","additionalProperties":false,"required":["kind","parameters"],"properties":{"kind":{"const":"sphere"},"parameters":{"type":"object","additionalProperties":false,"required":["radius","widthSegments","heightSegments"],"properties":{"radius":{"$ref":"#/$defs/positiveLength"},"widthSegments":{"type":"integer","minimum":3,"maximum":256},"heightSegments":{"type":"integer","minimum":2,"maximum":256}}}}};

function validate42(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate42.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.kind === undefined){
const err0 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "kind"},message:"must have required property '"+"kind"+"'"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(data.parameters === undefined){
const err1 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "parameters"},message:"must have required property '"+"parameters"+"'"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
for(const key0 in data){
if(!((key0 === "kind") || (key0 === "parameters"))){
const err2 = {instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
}
if(data.kind !== undefined){
if("sphere" !== data.kind){
const err3 = {instancePath:instancePath+"/kind",schemaPath:"#/properties/kind/const",keyword:"const",params:{allowedValue: "sphere"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
}
if(data.parameters !== undefined){
let data1 = data.parameters;
if(data1 && typeof data1 == "object" && !Array.isArray(data1)){
if(data1.radius === undefined){
const err4 = {instancePath:instancePath+"/parameters",schemaPath:"#/properties/parameters/required",keyword:"required",params:{missingProperty: "radius"},message:"must have required property '"+"radius"+"'"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
if(data1.widthSegments === undefined){
const err5 = {instancePath:instancePath+"/parameters",schemaPath:"#/properties/parameters/required",keyword:"required",params:{missingProperty: "widthSegments"},message:"must have required property '"+"widthSegments"+"'"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
if(data1.heightSegments === undefined){
const err6 = {instancePath:instancePath+"/parameters",schemaPath:"#/properties/parameters/required",keyword:"required",params:{missingProperty: "heightSegments"},message:"must have required property '"+"heightSegments"+"'"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
for(const key1 in data1){
if(!(((key1 === "radius") || (key1 === "widthSegments")) || (key1 === "heightSegments"))){
const err7 = {instancePath:instancePath+"/parameters",schemaPath:"#/properties/parameters/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key1},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
}
if(data1.radius !== undefined){
let data2 = data1.radius;
if((typeof data2 == "number") && (isFinite(data2))){
if(data2 > 10000 || isNaN(data2)){
const err8 = {instancePath:instancePath+"/parameters/radius",schemaPath:"#/$defs/positiveLength/maximum",keyword:"maximum",params:{comparison: "<=", limit: 10000},message:"must be <= 10000"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
if(data2 <= 0.000001 || isNaN(data2)){
const err9 = {instancePath:instancePath+"/parameters/radius",schemaPath:"#/$defs/positiveLength/exclusiveMinimum",keyword:"exclusiveMinimum",params:{comparison: ">", limit: 0.000001},message:"must be > 0.000001"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
}
else {
const err10 = {instancePath:instancePath+"/parameters/radius",schemaPath:"#/$defs/positiveLength/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
}
if(data1.widthSegments !== undefined){
let data3 = data1.widthSegments;
if(!(((typeof data3 == "number") && (!(data3 % 1) && !isNaN(data3))) && (isFinite(data3)))){
const err11 = {instancePath:instancePath+"/parameters/widthSegments",schemaPath:"#/properties/parameters/properties/widthSegments/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
if((typeof data3 == "number") && (isFinite(data3))){
if(data3 > 256 || isNaN(data3)){
const err12 = {instancePath:instancePath+"/parameters/widthSegments",schemaPath:"#/properties/parameters/properties/widthSegments/maximum",keyword:"maximum",params:{comparison: "<=", limit: 256},message:"must be <= 256"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
if(data3 < 3 || isNaN(data3)){
const err13 = {instancePath:instancePath+"/parameters/widthSegments",schemaPath:"#/properties/parameters/properties/widthSegments/minimum",keyword:"minimum",params:{comparison: ">=", limit: 3},message:"must be >= 3"};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
}
}
if(data1.heightSegments !== undefined){
let data4 = data1.heightSegments;
if(!(((typeof data4 == "number") && (!(data4 % 1) && !isNaN(data4))) && (isFinite(data4)))){
const err14 = {instancePath:instancePath+"/parameters/heightSegments",schemaPath:"#/properties/parameters/properties/heightSegments/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
}
if((typeof data4 == "number") && (isFinite(data4))){
if(data4 > 256 || isNaN(data4)){
const err15 = {instancePath:instancePath+"/parameters/heightSegments",schemaPath:"#/properties/parameters/properties/heightSegments/maximum",keyword:"maximum",params:{comparison: "<=", limit: 256},message:"must be <= 256"};
if(vErrors === null){
vErrors = [err15];
}
else {
vErrors.push(err15);
}
errors++;
}
if(data4 < 2 || isNaN(data4)){
const err16 = {instancePath:instancePath+"/parameters/heightSegments",schemaPath:"#/properties/parameters/properties/heightSegments/minimum",keyword:"minimum",params:{comparison: ">=", limit: 2},message:"must be >= 2"};
if(vErrors === null){
vErrors = [err16];
}
else {
vErrors.push(err16);
}
errors++;
}
}
}
}
else {
const err17 = {instancePath:instancePath+"/parameters",schemaPath:"#/properties/parameters/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err17];
}
else {
vErrors.push(err17);
}
errors++;
}
}
}
else {
const err18 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err18];
}
else {
vErrors.push(err18);
}
errors++;
}
validate42.errors = vErrors;
return errors === 0;
}
validate42.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

const schema64 = {"type":"object","additionalProperties":false,"required":["kind","parameters"],"properties":{"kind":{"const":"cylinder"},"parameters":{"type":"object","additionalProperties":false,"required":["radiusTop","radiusBottom","height","radialSegments","heightSegments","openEnded"],"properties":{"radiusTop":{"$ref":"#/$defs/nonNegativeLength"},"radiusBottom":{"$ref":"#/$defs/nonNegativeLength"},"height":{"$ref":"#/$defs/positiveLength"},"radialSegments":{"$ref":"#/$defs/radialSegments"},"heightSegments":{"$ref":"#/$defs/linearSegments"},"openEnded":{"type":"boolean"}},"anyOf":[{"properties":{"radiusTop":{"type":"number","exclusiveMinimum":0}}},{"properties":{"radiusBottom":{"type":"number","exclusiveMinimum":0}}}]}}};
const schema65 = {"type":"number","minimum":0,"maximum":10000};
const schema68 = {"type":"integer","minimum":3,"maximum":256};

function validate44(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate44.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.kind === undefined){
const err0 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "kind"},message:"must have required property '"+"kind"+"'"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(data.parameters === undefined){
const err1 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "parameters"},message:"must have required property '"+"parameters"+"'"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
for(const key0 in data){
if(!((key0 === "kind") || (key0 === "parameters"))){
const err2 = {instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
}
if(data.kind !== undefined){
if("cylinder" !== data.kind){
const err3 = {instancePath:instancePath+"/kind",schemaPath:"#/properties/kind/const",keyword:"const",params:{allowedValue: "cylinder"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
}
if(data.parameters !== undefined){
let data1 = data.parameters;
const _errs5 = errors;
let valid1 = false;
const _errs6 = errors;
if(data1 && typeof data1 == "object" && !Array.isArray(data1)){
if(data1.radiusTop !== undefined){
let data2 = data1.radiusTop;
if((typeof data2 == "number") && (isFinite(data2))){
if(data2 <= 0 || isNaN(data2)){
const err4 = {instancePath:instancePath+"/parameters/radiusTop",schemaPath:"#/properties/parameters/anyOf/0/properties/radiusTop/exclusiveMinimum",keyword:"exclusiveMinimum",params:{comparison: ">", limit: 0},message:"must be > 0"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
}
else {
const err5 = {instancePath:instancePath+"/parameters/radiusTop",schemaPath:"#/properties/parameters/anyOf/0/properties/radiusTop/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
}
}
var _valid0 = _errs6 === errors;
valid1 = valid1 || _valid0;
if(_valid0){
var props0 = {};
props0.radiusTop = true;
}
const _errs9 = errors;
if(data1 && typeof data1 == "object" && !Array.isArray(data1)){
if(data1.radiusBottom !== undefined){
let data3 = data1.radiusBottom;
if((typeof data3 == "number") && (isFinite(data3))){
if(data3 <= 0 || isNaN(data3)){
const err6 = {instancePath:instancePath+"/parameters/radiusBottom",schemaPath:"#/properties/parameters/anyOf/1/properties/radiusBottom/exclusiveMinimum",keyword:"exclusiveMinimum",params:{comparison: ">", limit: 0},message:"must be > 0"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
}
else {
const err7 = {instancePath:instancePath+"/parameters/radiusBottom",schemaPath:"#/properties/parameters/anyOf/1/properties/radiusBottom/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
}
}
var _valid0 = _errs9 === errors;
valid1 = valid1 || _valid0;
if(_valid0){
if(props0 !== true){
props0 = props0 || {};
props0.radiusBottom = true;
}
}
if(!valid1){
const err8 = {instancePath:instancePath+"/parameters",schemaPath:"#/properties/parameters/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
else {
errors = _errs5;
if(vErrors !== null){
if(_errs5){
vErrors.length = _errs5;
}
else {
vErrors = null;
}
}
}
if(data1 && typeof data1 == "object" && !Array.isArray(data1)){
if(data1.radiusTop === undefined){
const err9 = {instancePath:instancePath+"/parameters",schemaPath:"#/properties/parameters/required",keyword:"required",params:{missingProperty: "radiusTop"},message:"must have required property '"+"radiusTop"+"'"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
if(data1.radiusBottom === undefined){
const err10 = {instancePath:instancePath+"/parameters",schemaPath:"#/properties/parameters/required",keyword:"required",params:{missingProperty: "radiusBottom"},message:"must have required property '"+"radiusBottom"+"'"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
if(data1.height === undefined){
const err11 = {instancePath:instancePath+"/parameters",schemaPath:"#/properties/parameters/required",keyword:"required",params:{missingProperty: "height"},message:"must have required property '"+"height"+"'"};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
if(data1.radialSegments === undefined){
const err12 = {instancePath:instancePath+"/parameters",schemaPath:"#/properties/parameters/required",keyword:"required",params:{missingProperty: "radialSegments"},message:"must have required property '"+"radialSegments"+"'"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
if(data1.heightSegments === undefined){
const err13 = {instancePath:instancePath+"/parameters",schemaPath:"#/properties/parameters/required",keyword:"required",params:{missingProperty: "heightSegments"},message:"must have required property '"+"heightSegments"+"'"};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
if(data1.openEnded === undefined){
const err14 = {instancePath:instancePath+"/parameters",schemaPath:"#/properties/parameters/required",keyword:"required",params:{missingProperty: "openEnded"},message:"must have required property '"+"openEnded"+"'"};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
}
for(const key1 in data1){
if(!((((((key1 === "radiusTop") || (key1 === "radiusBottom")) || (key1 === "height")) || (key1 === "radialSegments")) || (key1 === "heightSegments")) || (key1 === "openEnded"))){
const err15 = {instancePath:instancePath+"/parameters",schemaPath:"#/properties/parameters/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key1},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err15];
}
else {
vErrors.push(err15);
}
errors++;
}
}
if(data1.radiusTop !== undefined){
let data4 = data1.radiusTop;
if((typeof data4 == "number") && (isFinite(data4))){
if(data4 > 10000 || isNaN(data4)){
const err16 = {instancePath:instancePath+"/parameters/radiusTop",schemaPath:"#/$defs/nonNegativeLength/maximum",keyword:"maximum",params:{comparison: "<=", limit: 10000},message:"must be <= 10000"};
if(vErrors === null){
vErrors = [err16];
}
else {
vErrors.push(err16);
}
errors++;
}
if(data4 < 0 || isNaN(data4)){
const err17 = {instancePath:instancePath+"/parameters/radiusTop",schemaPath:"#/$defs/nonNegativeLength/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err17];
}
else {
vErrors.push(err17);
}
errors++;
}
}
else {
const err18 = {instancePath:instancePath+"/parameters/radiusTop",schemaPath:"#/$defs/nonNegativeLength/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err18];
}
else {
vErrors.push(err18);
}
errors++;
}
}
if(data1.radiusBottom !== undefined){
let data5 = data1.radiusBottom;
if((typeof data5 == "number") && (isFinite(data5))){
if(data5 > 10000 || isNaN(data5)){
const err19 = {instancePath:instancePath+"/parameters/radiusBottom",schemaPath:"#/$defs/nonNegativeLength/maximum",keyword:"maximum",params:{comparison: "<=", limit: 10000},message:"must be <= 10000"};
if(vErrors === null){
vErrors = [err19];
}
else {
vErrors.push(err19);
}
errors++;
}
if(data5 < 0 || isNaN(data5)){
const err20 = {instancePath:instancePath+"/parameters/radiusBottom",schemaPath:"#/$defs/nonNegativeLength/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err20];
}
else {
vErrors.push(err20);
}
errors++;
}
}
else {
const err21 = {instancePath:instancePath+"/parameters/radiusBottom",schemaPath:"#/$defs/nonNegativeLength/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err21];
}
else {
vErrors.push(err21);
}
errors++;
}
}
if(data1.height !== undefined){
let data6 = data1.height;
if((typeof data6 == "number") && (isFinite(data6))){
if(data6 > 10000 || isNaN(data6)){
const err22 = {instancePath:instancePath+"/parameters/height",schemaPath:"#/$defs/positiveLength/maximum",keyword:"maximum",params:{comparison: "<=", limit: 10000},message:"must be <= 10000"};
if(vErrors === null){
vErrors = [err22];
}
else {
vErrors.push(err22);
}
errors++;
}
if(data6 <= 0.000001 || isNaN(data6)){
const err23 = {instancePath:instancePath+"/parameters/height",schemaPath:"#/$defs/positiveLength/exclusiveMinimum",keyword:"exclusiveMinimum",params:{comparison: ">", limit: 0.000001},message:"must be > 0.000001"};
if(vErrors === null){
vErrors = [err23];
}
else {
vErrors.push(err23);
}
errors++;
}
}
else {
const err24 = {instancePath:instancePath+"/parameters/height",schemaPath:"#/$defs/positiveLength/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err24];
}
else {
vErrors.push(err24);
}
errors++;
}
}
if(data1.radialSegments !== undefined){
let data7 = data1.radialSegments;
if(!(((typeof data7 == "number") && (!(data7 % 1) && !isNaN(data7))) && (isFinite(data7)))){
const err25 = {instancePath:instancePath+"/parameters/radialSegments",schemaPath:"#/$defs/radialSegments/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err25];
}
else {
vErrors.push(err25);
}
errors++;
}
if((typeof data7 == "number") && (isFinite(data7))){
if(data7 > 256 || isNaN(data7)){
const err26 = {instancePath:instancePath+"/parameters/radialSegments",schemaPath:"#/$defs/radialSegments/maximum",keyword:"maximum",params:{comparison: "<=", limit: 256},message:"must be <= 256"};
if(vErrors === null){
vErrors = [err26];
}
else {
vErrors.push(err26);
}
errors++;
}
if(data7 < 3 || isNaN(data7)){
const err27 = {instancePath:instancePath+"/parameters/radialSegments",schemaPath:"#/$defs/radialSegments/minimum",keyword:"minimum",params:{comparison: ">=", limit: 3},message:"must be >= 3"};
if(vErrors === null){
vErrors = [err27];
}
else {
vErrors.push(err27);
}
errors++;
}
}
}
if(data1.heightSegments !== undefined){
let data8 = data1.heightSegments;
if(!(((typeof data8 == "number") && (!(data8 % 1) && !isNaN(data8))) && (isFinite(data8)))){
const err28 = {instancePath:instancePath+"/parameters/heightSegments",schemaPath:"#/$defs/linearSegments/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err28];
}
else {
vErrors.push(err28);
}
errors++;
}
if((typeof data8 == "number") && (isFinite(data8))){
if(data8 > 64 || isNaN(data8)){
const err29 = {instancePath:instancePath+"/parameters/heightSegments",schemaPath:"#/$defs/linearSegments/maximum",keyword:"maximum",params:{comparison: "<=", limit: 64},message:"must be <= 64"};
if(vErrors === null){
vErrors = [err29];
}
else {
vErrors.push(err29);
}
errors++;
}
if(data8 < 1 || isNaN(data8)){
const err30 = {instancePath:instancePath+"/parameters/heightSegments",schemaPath:"#/$defs/linearSegments/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"};
if(vErrors === null){
vErrors = [err30];
}
else {
vErrors.push(err30);
}
errors++;
}
}
}
if(data1.openEnded !== undefined){
if(typeof data1.openEnded !== "boolean"){
const err31 = {instancePath:instancePath+"/parameters/openEnded",schemaPath:"#/properties/parameters/properties/openEnded/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};
if(vErrors === null){
vErrors = [err31];
}
else {
vErrors.push(err31);
}
errors++;
}
}
}
else {
const err32 = {instancePath:instancePath+"/parameters",schemaPath:"#/properties/parameters/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err32];
}
else {
vErrors.push(err32);
}
errors++;
}
}
}
else {
const err33 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err33];
}
else {
vErrors.push(err33);
}
errors++;
}
validate44.errors = vErrors;
return errors === 0;
}
validate44.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

const schema70 = {"type":"object","additionalProperties":false,"required":["kind","parameters"],"properties":{"kind":{"const":"cone"},"parameters":{"type":"object","additionalProperties":false,"required":["radius","height","radialSegments","heightSegments","openEnded"],"properties":{"radius":{"$ref":"#/$defs/positiveLength"},"height":{"$ref":"#/$defs/positiveLength"},"radialSegments":{"$ref":"#/$defs/radialSegments"},"heightSegments":{"$ref":"#/$defs/linearSegments"},"openEnded":{"type":"boolean"}}}}};

function validate46(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate46.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.kind === undefined){
const err0 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "kind"},message:"must have required property '"+"kind"+"'"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(data.parameters === undefined){
const err1 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "parameters"},message:"must have required property '"+"parameters"+"'"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
for(const key0 in data){
if(!((key0 === "kind") || (key0 === "parameters"))){
const err2 = {instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
}
if(data.kind !== undefined){
if("cone" !== data.kind){
const err3 = {instancePath:instancePath+"/kind",schemaPath:"#/properties/kind/const",keyword:"const",params:{allowedValue: "cone"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
}
if(data.parameters !== undefined){
let data1 = data.parameters;
if(data1 && typeof data1 == "object" && !Array.isArray(data1)){
if(data1.radius === undefined){
const err4 = {instancePath:instancePath+"/parameters",schemaPath:"#/properties/parameters/required",keyword:"required",params:{missingProperty: "radius"},message:"must have required property '"+"radius"+"'"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
if(data1.height === undefined){
const err5 = {instancePath:instancePath+"/parameters",schemaPath:"#/properties/parameters/required",keyword:"required",params:{missingProperty: "height"},message:"must have required property '"+"height"+"'"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
if(data1.radialSegments === undefined){
const err6 = {instancePath:instancePath+"/parameters",schemaPath:"#/properties/parameters/required",keyword:"required",params:{missingProperty: "radialSegments"},message:"must have required property '"+"radialSegments"+"'"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
if(data1.heightSegments === undefined){
const err7 = {instancePath:instancePath+"/parameters",schemaPath:"#/properties/parameters/required",keyword:"required",params:{missingProperty: "heightSegments"},message:"must have required property '"+"heightSegments"+"'"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
if(data1.openEnded === undefined){
const err8 = {instancePath:instancePath+"/parameters",schemaPath:"#/properties/parameters/required",keyword:"required",params:{missingProperty: "openEnded"},message:"must have required property '"+"openEnded"+"'"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
for(const key1 in data1){
if(!(((((key1 === "radius") || (key1 === "height")) || (key1 === "radialSegments")) || (key1 === "heightSegments")) || (key1 === "openEnded"))){
const err9 = {instancePath:instancePath+"/parameters",schemaPath:"#/properties/parameters/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key1},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
}
if(data1.radius !== undefined){
let data2 = data1.radius;
if((typeof data2 == "number") && (isFinite(data2))){
if(data2 > 10000 || isNaN(data2)){
const err10 = {instancePath:instancePath+"/parameters/radius",schemaPath:"#/$defs/positiveLength/maximum",keyword:"maximum",params:{comparison: "<=", limit: 10000},message:"must be <= 10000"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
if(data2 <= 0.000001 || isNaN(data2)){
const err11 = {instancePath:instancePath+"/parameters/radius",schemaPath:"#/$defs/positiveLength/exclusiveMinimum",keyword:"exclusiveMinimum",params:{comparison: ">", limit: 0.000001},message:"must be > 0.000001"};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
}
else {
const err12 = {instancePath:instancePath+"/parameters/radius",schemaPath:"#/$defs/positiveLength/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
}
if(data1.height !== undefined){
let data3 = data1.height;
if((typeof data3 == "number") && (isFinite(data3))){
if(data3 > 10000 || isNaN(data3)){
const err13 = {instancePath:instancePath+"/parameters/height",schemaPath:"#/$defs/positiveLength/maximum",keyword:"maximum",params:{comparison: "<=", limit: 10000},message:"must be <= 10000"};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
if(data3 <= 0.000001 || isNaN(data3)){
const err14 = {instancePath:instancePath+"/parameters/height",schemaPath:"#/$defs/positiveLength/exclusiveMinimum",keyword:"exclusiveMinimum",params:{comparison: ">", limit: 0.000001},message:"must be > 0.000001"};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
}
}
else {
const err15 = {instancePath:instancePath+"/parameters/height",schemaPath:"#/$defs/positiveLength/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err15];
}
else {
vErrors.push(err15);
}
errors++;
}
}
if(data1.radialSegments !== undefined){
let data4 = data1.radialSegments;
if(!(((typeof data4 == "number") && (!(data4 % 1) && !isNaN(data4))) && (isFinite(data4)))){
const err16 = {instancePath:instancePath+"/parameters/radialSegments",schemaPath:"#/$defs/radialSegments/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err16];
}
else {
vErrors.push(err16);
}
errors++;
}
if((typeof data4 == "number") && (isFinite(data4))){
if(data4 > 256 || isNaN(data4)){
const err17 = {instancePath:instancePath+"/parameters/radialSegments",schemaPath:"#/$defs/radialSegments/maximum",keyword:"maximum",params:{comparison: "<=", limit: 256},message:"must be <= 256"};
if(vErrors === null){
vErrors = [err17];
}
else {
vErrors.push(err17);
}
errors++;
}
if(data4 < 3 || isNaN(data4)){
const err18 = {instancePath:instancePath+"/parameters/radialSegments",schemaPath:"#/$defs/radialSegments/minimum",keyword:"minimum",params:{comparison: ">=", limit: 3},message:"must be >= 3"};
if(vErrors === null){
vErrors = [err18];
}
else {
vErrors.push(err18);
}
errors++;
}
}
}
if(data1.heightSegments !== undefined){
let data5 = data1.heightSegments;
if(!(((typeof data5 == "number") && (!(data5 % 1) && !isNaN(data5))) && (isFinite(data5)))){
const err19 = {instancePath:instancePath+"/parameters/heightSegments",schemaPath:"#/$defs/linearSegments/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err19];
}
else {
vErrors.push(err19);
}
errors++;
}
if((typeof data5 == "number") && (isFinite(data5))){
if(data5 > 64 || isNaN(data5)){
const err20 = {instancePath:instancePath+"/parameters/heightSegments",schemaPath:"#/$defs/linearSegments/maximum",keyword:"maximum",params:{comparison: "<=", limit: 64},message:"must be <= 64"};
if(vErrors === null){
vErrors = [err20];
}
else {
vErrors.push(err20);
}
errors++;
}
if(data5 < 1 || isNaN(data5)){
const err21 = {instancePath:instancePath+"/parameters/heightSegments",schemaPath:"#/$defs/linearSegments/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"};
if(vErrors === null){
vErrors = [err21];
}
else {
vErrors.push(err21);
}
errors++;
}
}
}
if(data1.openEnded !== undefined){
if(typeof data1.openEnded !== "boolean"){
const err22 = {instancePath:instancePath+"/parameters/openEnded",schemaPath:"#/properties/parameters/properties/openEnded/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};
if(vErrors === null){
vErrors = [err22];
}
else {
vErrors.push(err22);
}
errors++;
}
}
}
else {
const err23 = {instancePath:instancePath+"/parameters",schemaPath:"#/properties/parameters/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err23];
}
else {
vErrors.push(err23);
}
errors++;
}
}
}
else {
const err24 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err24];
}
else {
vErrors.push(err24);
}
errors++;
}
validate46.errors = vErrors;
return errors === 0;
}
validate46.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

const schema75 = {"type":"object","additionalProperties":false,"required":["kind","parameters"],"properties":{"kind":{"const":"plane"},"parameters":{"type":"object","additionalProperties":false,"required":["width","height","widthSegments","heightSegments"],"properties":{"width":{"$ref":"#/$defs/positiveLength"},"height":{"$ref":"#/$defs/positiveLength"},"widthSegments":{"$ref":"#/$defs/linearSegments"},"heightSegments":{"$ref":"#/$defs/linearSegments"}}}}};

function validate48(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate48.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.kind === undefined){
const err0 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "kind"},message:"must have required property '"+"kind"+"'"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(data.parameters === undefined){
const err1 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "parameters"},message:"must have required property '"+"parameters"+"'"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
for(const key0 in data){
if(!((key0 === "kind") || (key0 === "parameters"))){
const err2 = {instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
}
if(data.kind !== undefined){
if("plane" !== data.kind){
const err3 = {instancePath:instancePath+"/kind",schemaPath:"#/properties/kind/const",keyword:"const",params:{allowedValue: "plane"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
}
if(data.parameters !== undefined){
let data1 = data.parameters;
if(data1 && typeof data1 == "object" && !Array.isArray(data1)){
if(data1.width === undefined){
const err4 = {instancePath:instancePath+"/parameters",schemaPath:"#/properties/parameters/required",keyword:"required",params:{missingProperty: "width"},message:"must have required property '"+"width"+"'"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
if(data1.height === undefined){
const err5 = {instancePath:instancePath+"/parameters",schemaPath:"#/properties/parameters/required",keyword:"required",params:{missingProperty: "height"},message:"must have required property '"+"height"+"'"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
if(data1.widthSegments === undefined){
const err6 = {instancePath:instancePath+"/parameters",schemaPath:"#/properties/parameters/required",keyword:"required",params:{missingProperty: "widthSegments"},message:"must have required property '"+"widthSegments"+"'"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
if(data1.heightSegments === undefined){
const err7 = {instancePath:instancePath+"/parameters",schemaPath:"#/properties/parameters/required",keyword:"required",params:{missingProperty: "heightSegments"},message:"must have required property '"+"heightSegments"+"'"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
for(const key1 in data1){
if(!((((key1 === "width") || (key1 === "height")) || (key1 === "widthSegments")) || (key1 === "heightSegments"))){
const err8 = {instancePath:instancePath+"/parameters",schemaPath:"#/properties/parameters/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key1},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
}
if(data1.width !== undefined){
let data2 = data1.width;
if((typeof data2 == "number") && (isFinite(data2))){
if(data2 > 10000 || isNaN(data2)){
const err9 = {instancePath:instancePath+"/parameters/width",schemaPath:"#/$defs/positiveLength/maximum",keyword:"maximum",params:{comparison: "<=", limit: 10000},message:"must be <= 10000"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
if(data2 <= 0.000001 || isNaN(data2)){
const err10 = {instancePath:instancePath+"/parameters/width",schemaPath:"#/$defs/positiveLength/exclusiveMinimum",keyword:"exclusiveMinimum",params:{comparison: ">", limit: 0.000001},message:"must be > 0.000001"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
}
else {
const err11 = {instancePath:instancePath+"/parameters/width",schemaPath:"#/$defs/positiveLength/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
}
if(data1.height !== undefined){
let data3 = data1.height;
if((typeof data3 == "number") && (isFinite(data3))){
if(data3 > 10000 || isNaN(data3)){
const err12 = {instancePath:instancePath+"/parameters/height",schemaPath:"#/$defs/positiveLength/maximum",keyword:"maximum",params:{comparison: "<=", limit: 10000},message:"must be <= 10000"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
if(data3 <= 0.000001 || isNaN(data3)){
const err13 = {instancePath:instancePath+"/parameters/height",schemaPath:"#/$defs/positiveLength/exclusiveMinimum",keyword:"exclusiveMinimum",params:{comparison: ">", limit: 0.000001},message:"must be > 0.000001"};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
}
else {
const err14 = {instancePath:instancePath+"/parameters/height",schemaPath:"#/$defs/positiveLength/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
}
}
if(data1.widthSegments !== undefined){
let data4 = data1.widthSegments;
if(!(((typeof data4 == "number") && (!(data4 % 1) && !isNaN(data4))) && (isFinite(data4)))){
const err15 = {instancePath:instancePath+"/parameters/widthSegments",schemaPath:"#/$defs/linearSegments/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err15];
}
else {
vErrors.push(err15);
}
errors++;
}
if((typeof data4 == "number") && (isFinite(data4))){
if(data4 > 64 || isNaN(data4)){
const err16 = {instancePath:instancePath+"/parameters/widthSegments",schemaPath:"#/$defs/linearSegments/maximum",keyword:"maximum",params:{comparison: "<=", limit: 64},message:"must be <= 64"};
if(vErrors === null){
vErrors = [err16];
}
else {
vErrors.push(err16);
}
errors++;
}
if(data4 < 1 || isNaN(data4)){
const err17 = {instancePath:instancePath+"/parameters/widthSegments",schemaPath:"#/$defs/linearSegments/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"};
if(vErrors === null){
vErrors = [err17];
}
else {
vErrors.push(err17);
}
errors++;
}
}
}
if(data1.heightSegments !== undefined){
let data5 = data1.heightSegments;
if(!(((typeof data5 == "number") && (!(data5 % 1) && !isNaN(data5))) && (isFinite(data5)))){
const err18 = {instancePath:instancePath+"/parameters/heightSegments",schemaPath:"#/$defs/linearSegments/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err18];
}
else {
vErrors.push(err18);
}
errors++;
}
if((typeof data5 == "number") && (isFinite(data5))){
if(data5 > 64 || isNaN(data5)){
const err19 = {instancePath:instancePath+"/parameters/heightSegments",schemaPath:"#/$defs/linearSegments/maximum",keyword:"maximum",params:{comparison: "<=", limit: 64},message:"must be <= 64"};
if(vErrors === null){
vErrors = [err19];
}
else {
vErrors.push(err19);
}
errors++;
}
if(data5 < 1 || isNaN(data5)){
const err20 = {instancePath:instancePath+"/parameters/heightSegments",schemaPath:"#/$defs/linearSegments/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"};
if(vErrors === null){
vErrors = [err20];
}
else {
vErrors.push(err20);
}
errors++;
}
}
}
}
else {
const err21 = {instancePath:instancePath+"/parameters",schemaPath:"#/properties/parameters/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err21];
}
else {
vErrors.push(err21);
}
errors++;
}
}
}
else {
const err22 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err22];
}
else {
vErrors.push(err22);
}
errors++;
}
validate48.errors = vErrors;
return errors === 0;
}
validate48.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

const schema80 = {"type":"object","additionalProperties":false,"required":["kind","parameters"],"properties":{"kind":{"const":"torus"},"parameters":{"type":"object","additionalProperties":false,"required":["radius","tube","radialSegments","tubularSegments","arc"],"properties":{"radius":{"$ref":"#/$defs/positiveLength"},"tube":{"$ref":"#/$defs/positiveLength"},"radialSegments":{"$ref":"#/$defs/radialSegments"},"tubularSegments":{"type":"integer","minimum":3,"maximum":512},"arc":{"type":"number","exclusiveMinimum":0,"maximum":6.283185307179586}}}}};

function validate50(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate50.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.kind === undefined){
const err0 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "kind"},message:"must have required property '"+"kind"+"'"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(data.parameters === undefined){
const err1 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "parameters"},message:"must have required property '"+"parameters"+"'"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
for(const key0 in data){
if(!((key0 === "kind") || (key0 === "parameters"))){
const err2 = {instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
}
if(data.kind !== undefined){
if("torus" !== data.kind){
const err3 = {instancePath:instancePath+"/kind",schemaPath:"#/properties/kind/const",keyword:"const",params:{allowedValue: "torus"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
}
if(data.parameters !== undefined){
let data1 = data.parameters;
if(data1 && typeof data1 == "object" && !Array.isArray(data1)){
if(data1.radius === undefined){
const err4 = {instancePath:instancePath+"/parameters",schemaPath:"#/properties/parameters/required",keyword:"required",params:{missingProperty: "radius"},message:"must have required property '"+"radius"+"'"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
if(data1.tube === undefined){
const err5 = {instancePath:instancePath+"/parameters",schemaPath:"#/properties/parameters/required",keyword:"required",params:{missingProperty: "tube"},message:"must have required property '"+"tube"+"'"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
if(data1.radialSegments === undefined){
const err6 = {instancePath:instancePath+"/parameters",schemaPath:"#/properties/parameters/required",keyword:"required",params:{missingProperty: "radialSegments"},message:"must have required property '"+"radialSegments"+"'"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
if(data1.tubularSegments === undefined){
const err7 = {instancePath:instancePath+"/parameters",schemaPath:"#/properties/parameters/required",keyword:"required",params:{missingProperty: "tubularSegments"},message:"must have required property '"+"tubularSegments"+"'"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
if(data1.arc === undefined){
const err8 = {instancePath:instancePath+"/parameters",schemaPath:"#/properties/parameters/required",keyword:"required",params:{missingProperty: "arc"},message:"must have required property '"+"arc"+"'"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
for(const key1 in data1){
if(!(((((key1 === "radius") || (key1 === "tube")) || (key1 === "radialSegments")) || (key1 === "tubularSegments")) || (key1 === "arc"))){
const err9 = {instancePath:instancePath+"/parameters",schemaPath:"#/properties/parameters/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key1},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
}
if(data1.radius !== undefined){
let data2 = data1.radius;
if((typeof data2 == "number") && (isFinite(data2))){
if(data2 > 10000 || isNaN(data2)){
const err10 = {instancePath:instancePath+"/parameters/radius",schemaPath:"#/$defs/positiveLength/maximum",keyword:"maximum",params:{comparison: "<=", limit: 10000},message:"must be <= 10000"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
if(data2 <= 0.000001 || isNaN(data2)){
const err11 = {instancePath:instancePath+"/parameters/radius",schemaPath:"#/$defs/positiveLength/exclusiveMinimum",keyword:"exclusiveMinimum",params:{comparison: ">", limit: 0.000001},message:"must be > 0.000001"};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
}
else {
const err12 = {instancePath:instancePath+"/parameters/radius",schemaPath:"#/$defs/positiveLength/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
}
if(data1.tube !== undefined){
let data3 = data1.tube;
if((typeof data3 == "number") && (isFinite(data3))){
if(data3 > 10000 || isNaN(data3)){
const err13 = {instancePath:instancePath+"/parameters/tube",schemaPath:"#/$defs/positiveLength/maximum",keyword:"maximum",params:{comparison: "<=", limit: 10000},message:"must be <= 10000"};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
if(data3 <= 0.000001 || isNaN(data3)){
const err14 = {instancePath:instancePath+"/parameters/tube",schemaPath:"#/$defs/positiveLength/exclusiveMinimum",keyword:"exclusiveMinimum",params:{comparison: ">", limit: 0.000001},message:"must be > 0.000001"};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
}
}
else {
const err15 = {instancePath:instancePath+"/parameters/tube",schemaPath:"#/$defs/positiveLength/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err15];
}
else {
vErrors.push(err15);
}
errors++;
}
}
if(data1.radialSegments !== undefined){
let data4 = data1.radialSegments;
if(!(((typeof data4 == "number") && (!(data4 % 1) && !isNaN(data4))) && (isFinite(data4)))){
const err16 = {instancePath:instancePath+"/parameters/radialSegments",schemaPath:"#/$defs/radialSegments/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err16];
}
else {
vErrors.push(err16);
}
errors++;
}
if((typeof data4 == "number") && (isFinite(data4))){
if(data4 > 256 || isNaN(data4)){
const err17 = {instancePath:instancePath+"/parameters/radialSegments",schemaPath:"#/$defs/radialSegments/maximum",keyword:"maximum",params:{comparison: "<=", limit: 256},message:"must be <= 256"};
if(vErrors === null){
vErrors = [err17];
}
else {
vErrors.push(err17);
}
errors++;
}
if(data4 < 3 || isNaN(data4)){
const err18 = {instancePath:instancePath+"/parameters/radialSegments",schemaPath:"#/$defs/radialSegments/minimum",keyword:"minimum",params:{comparison: ">=", limit: 3},message:"must be >= 3"};
if(vErrors === null){
vErrors = [err18];
}
else {
vErrors.push(err18);
}
errors++;
}
}
}
if(data1.tubularSegments !== undefined){
let data5 = data1.tubularSegments;
if(!(((typeof data5 == "number") && (!(data5 % 1) && !isNaN(data5))) && (isFinite(data5)))){
const err19 = {instancePath:instancePath+"/parameters/tubularSegments",schemaPath:"#/properties/parameters/properties/tubularSegments/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err19];
}
else {
vErrors.push(err19);
}
errors++;
}
if((typeof data5 == "number") && (isFinite(data5))){
if(data5 > 512 || isNaN(data5)){
const err20 = {instancePath:instancePath+"/parameters/tubularSegments",schemaPath:"#/properties/parameters/properties/tubularSegments/maximum",keyword:"maximum",params:{comparison: "<=", limit: 512},message:"must be <= 512"};
if(vErrors === null){
vErrors = [err20];
}
else {
vErrors.push(err20);
}
errors++;
}
if(data5 < 3 || isNaN(data5)){
const err21 = {instancePath:instancePath+"/parameters/tubularSegments",schemaPath:"#/properties/parameters/properties/tubularSegments/minimum",keyword:"minimum",params:{comparison: ">=", limit: 3},message:"must be >= 3"};
if(vErrors === null){
vErrors = [err21];
}
else {
vErrors.push(err21);
}
errors++;
}
}
}
if(data1.arc !== undefined){
let data6 = data1.arc;
if((typeof data6 == "number") && (isFinite(data6))){
if(data6 > 6.283185307179586 || isNaN(data6)){
const err22 = {instancePath:instancePath+"/parameters/arc",schemaPath:"#/properties/parameters/properties/arc/maximum",keyword:"maximum",params:{comparison: "<=", limit: 6.283185307179586},message:"must be <= 6.283185307179586"};
if(vErrors === null){
vErrors = [err22];
}
else {
vErrors.push(err22);
}
errors++;
}
if(data6 <= 0 || isNaN(data6)){
const err23 = {instancePath:instancePath+"/parameters/arc",schemaPath:"#/properties/parameters/properties/arc/exclusiveMinimum",keyword:"exclusiveMinimum",params:{comparison: ">", limit: 0},message:"must be > 0"};
if(vErrors === null){
vErrors = [err23];
}
else {
vErrors.push(err23);
}
errors++;
}
}
else {
const err24 = {instancePath:instancePath+"/parameters/arc",schemaPath:"#/properties/parameters/properties/arc/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err24];
}
else {
vErrors.push(err24);
}
errors++;
}
}
}
else {
const err25 = {instancePath:instancePath+"/parameters",schemaPath:"#/properties/parameters/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err25];
}
else {
vErrors.push(err25);
}
errors++;
}
}
}
else {
const err26 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err26];
}
else {
vErrors.push(err26);
}
errors++;
}
validate50.errors = vErrors;
return errors === 0;
}
validate50.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

const schema84 = {"type":"object","additionalProperties":false,"required":["kind","parameters"],"properties":{"kind":{"const":"icosahedron"},"parameters":{"type":"object","additionalProperties":false,"required":["radius","detail"],"properties":{"radius":{"$ref":"#/$defs/positiveLength"},"detail":{"type":"integer","minimum":0,"maximum":5}}}}};

function validate52(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate52.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.kind === undefined){
const err0 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "kind"},message:"must have required property '"+"kind"+"'"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(data.parameters === undefined){
const err1 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "parameters"},message:"must have required property '"+"parameters"+"'"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
for(const key0 in data){
if(!((key0 === "kind") || (key0 === "parameters"))){
const err2 = {instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
}
if(data.kind !== undefined){
if("icosahedron" !== data.kind){
const err3 = {instancePath:instancePath+"/kind",schemaPath:"#/properties/kind/const",keyword:"const",params:{allowedValue: "icosahedron"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
}
if(data.parameters !== undefined){
let data1 = data.parameters;
if(data1 && typeof data1 == "object" && !Array.isArray(data1)){
if(data1.radius === undefined){
const err4 = {instancePath:instancePath+"/parameters",schemaPath:"#/properties/parameters/required",keyword:"required",params:{missingProperty: "radius"},message:"must have required property '"+"radius"+"'"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
if(data1.detail === undefined){
const err5 = {instancePath:instancePath+"/parameters",schemaPath:"#/properties/parameters/required",keyword:"required",params:{missingProperty: "detail"},message:"must have required property '"+"detail"+"'"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
for(const key1 in data1){
if(!((key1 === "radius") || (key1 === "detail"))){
const err6 = {instancePath:instancePath+"/parameters",schemaPath:"#/properties/parameters/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key1},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
}
if(data1.radius !== undefined){
let data2 = data1.radius;
if((typeof data2 == "number") && (isFinite(data2))){
if(data2 > 10000 || isNaN(data2)){
const err7 = {instancePath:instancePath+"/parameters/radius",schemaPath:"#/$defs/positiveLength/maximum",keyword:"maximum",params:{comparison: "<=", limit: 10000},message:"must be <= 10000"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
if(data2 <= 0.000001 || isNaN(data2)){
const err8 = {instancePath:instancePath+"/parameters/radius",schemaPath:"#/$defs/positiveLength/exclusiveMinimum",keyword:"exclusiveMinimum",params:{comparison: ">", limit: 0.000001},message:"must be > 0.000001"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
}
else {
const err9 = {instancePath:instancePath+"/parameters/radius",schemaPath:"#/$defs/positiveLength/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
}
if(data1.detail !== undefined){
let data3 = data1.detail;
if(!(((typeof data3 == "number") && (!(data3 % 1) && !isNaN(data3))) && (isFinite(data3)))){
const err10 = {instancePath:instancePath+"/parameters/detail",schemaPath:"#/properties/parameters/properties/detail/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
if((typeof data3 == "number") && (isFinite(data3))){
if(data3 > 5 || isNaN(data3)){
const err11 = {instancePath:instancePath+"/parameters/detail",schemaPath:"#/properties/parameters/properties/detail/maximum",keyword:"maximum",params:{comparison: "<=", limit: 5},message:"must be <= 5"};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
if(data3 < 0 || isNaN(data3)){
const err12 = {instancePath:instancePath+"/parameters/detail",schemaPath:"#/properties/parameters/properties/detail/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
}
}
}
else {
const err13 = {instancePath:instancePath+"/parameters",schemaPath:"#/properties/parameters/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
}
}
else {
const err14 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
}
validate52.errors = vErrors;
return errors === 0;
}
validate52.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};


function validate39(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate39.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
const _errs0 = errors;
let valid0 = false;
let passing0 = null;
const _errs1 = errors;
if(!(validate40(data, {instancePath,parentData,parentDataProperty,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate40.errors : vErrors.concat(validate40.errors);
errors = vErrors.length;
}
var _valid0 = _errs1 === errors;
if(_valid0){
valid0 = true;
passing0 = 0;
var props0 = true;
}
const _errs2 = errors;
if(!(validate42(data, {instancePath,parentData,parentDataProperty,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate42.errors : vErrors.concat(validate42.errors);
errors = vErrors.length;
}
var _valid0 = _errs2 === errors;
if(_valid0 && valid0){
valid0 = false;
passing0 = [passing0, 1];
}
else {
if(_valid0){
valid0 = true;
passing0 = 1;
if(props0 !== true){
props0 = true;
}
}
const _errs3 = errors;
if(!(validate44(data, {instancePath,parentData,parentDataProperty,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate44.errors : vErrors.concat(validate44.errors);
errors = vErrors.length;
}
var _valid0 = _errs3 === errors;
if(_valid0 && valid0){
valid0 = false;
passing0 = [passing0, 2];
}
else {
if(_valid0){
valid0 = true;
passing0 = 2;
if(props0 !== true){
props0 = true;
}
}
const _errs4 = errors;
if(!(validate46(data, {instancePath,parentData,parentDataProperty,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate46.errors : vErrors.concat(validate46.errors);
errors = vErrors.length;
}
var _valid0 = _errs4 === errors;
if(_valid0 && valid0){
valid0 = false;
passing0 = [passing0, 3];
}
else {
if(_valid0){
valid0 = true;
passing0 = 3;
if(props0 !== true){
props0 = true;
}
}
const _errs5 = errors;
if(!(validate48(data, {instancePath,parentData,parentDataProperty,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate48.errors : vErrors.concat(validate48.errors);
errors = vErrors.length;
}
var _valid0 = _errs5 === errors;
if(_valid0 && valid0){
valid0 = false;
passing0 = [passing0, 4];
}
else {
if(_valid0){
valid0 = true;
passing0 = 4;
if(props0 !== true){
props0 = true;
}
}
const _errs6 = errors;
if(!(validate50(data, {instancePath,parentData,parentDataProperty,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate50.errors : vErrors.concat(validate50.errors);
errors = vErrors.length;
}
var _valid0 = _errs6 === errors;
if(_valid0 && valid0){
valid0 = false;
passing0 = [passing0, 5];
}
else {
if(_valid0){
valid0 = true;
passing0 = 5;
if(props0 !== true){
props0 = true;
}
}
const _errs7 = errors;
if(!(validate52(data, {instancePath,parentData,parentDataProperty,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate52.errors : vErrors.concat(validate52.errors);
errors = vErrors.length;
}
var _valid0 = _errs7 === errors;
if(_valid0 && valid0){
valid0 = false;
passing0 = [passing0, 6];
}
else {
if(_valid0){
valid0 = true;
passing0 = 6;
if(props0 !== true){
props0 = true;
}
}
}
}
}
}
}
}
if(!valid0){
const err0 = {instancePath,schemaPath:"#/oneOf",keyword:"oneOf",params:{passingSchemas: passing0},message:"must match exactly one schema in oneOf"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
else {
errors = _errs0;
if(vErrors !== null){
if(_errs0){
vErrors.length = _errs0;
}
else {
vErrors = null;
}
}
}
validate39.errors = vErrors;
evaluated0.props = props0;
return errors === 0;
}
validate39.evaluated = {"dynamicProps":true,"dynamicItems":false};

const schema86 = {"type":"object","additionalProperties":false,"required":["type","color","roughness","metalness","opacity","transparent","wireframe","flatShading","side"],"properties":{"type":{"type":"string","const":"meshStandard"},"color":{"$ref":"#/$defs/color"},"roughness":{"type":"number","minimum":0,"maximum":1},"metalness":{"type":"number","minimum":0,"maximum":1},"opacity":{"type":"number","exclusiveMinimum":0,"maximum":1},"transparent":{"type":"boolean"},"wireframe":{"type":"boolean"},"flatShading":{"type":"boolean"},"side":{"type":"string","enum":["front","back","double"]}}};
const func11 = Object.prototype.hasOwnProperty;

function validate55(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate55.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.type === undefined){
const err0 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "type"},message:"must have required property '"+"type"+"'"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(data.color === undefined){
const err1 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "color"},message:"must have required property '"+"color"+"'"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
if(data.roughness === undefined){
const err2 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "roughness"},message:"must have required property '"+"roughness"+"'"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
if(data.metalness === undefined){
const err3 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "metalness"},message:"must have required property '"+"metalness"+"'"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
if(data.opacity === undefined){
const err4 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "opacity"},message:"must have required property '"+"opacity"+"'"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
if(data.transparent === undefined){
const err5 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "transparent"},message:"must have required property '"+"transparent"+"'"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
if(data.wireframe === undefined){
const err6 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "wireframe"},message:"must have required property '"+"wireframe"+"'"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
if(data.flatShading === undefined){
const err7 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "flatShading"},message:"must have required property '"+"flatShading"+"'"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
if(data.side === undefined){
const err8 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "side"},message:"must have required property '"+"side"+"'"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
for(const key0 in data){
if(!(func11.call(schema86.properties, key0))){
const err9 = {instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
}
if(data.type !== undefined){
let data0 = data.type;
if(typeof data0 !== "string"){
const err10 = {instancePath:instancePath+"/type",schemaPath:"#/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
if("meshStandard" !== data0){
const err11 = {instancePath:instancePath+"/type",schemaPath:"#/properties/type/const",keyword:"const",params:{allowedValue: "meshStandard"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
}
if(data.color !== undefined){
let data1 = data.color;
if(typeof data1 === "string"){
if(!pattern6.test(data1)){
const err12 = {instancePath:instancePath+"/color",schemaPath:"#/$defs/color/pattern",keyword:"pattern",params:{pattern: "^#[0-9A-Fa-f]{6}$"},message:"must match pattern \""+"^#[0-9A-Fa-f]{6}$"+"\""};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
}
else {
const err13 = {instancePath:instancePath+"/color",schemaPath:"#/$defs/color/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
}
if(data.roughness !== undefined){
let data2 = data.roughness;
if((typeof data2 == "number") && (isFinite(data2))){
if(data2 > 1 || isNaN(data2)){
const err14 = {instancePath:instancePath+"/roughness",schemaPath:"#/properties/roughness/maximum",keyword:"maximum",params:{comparison: "<=", limit: 1},message:"must be <= 1"};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
}
if(data2 < 0 || isNaN(data2)){
const err15 = {instancePath:instancePath+"/roughness",schemaPath:"#/properties/roughness/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err15];
}
else {
vErrors.push(err15);
}
errors++;
}
}
else {
const err16 = {instancePath:instancePath+"/roughness",schemaPath:"#/properties/roughness/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err16];
}
else {
vErrors.push(err16);
}
errors++;
}
}
if(data.metalness !== undefined){
let data3 = data.metalness;
if((typeof data3 == "number") && (isFinite(data3))){
if(data3 > 1 || isNaN(data3)){
const err17 = {instancePath:instancePath+"/metalness",schemaPath:"#/properties/metalness/maximum",keyword:"maximum",params:{comparison: "<=", limit: 1},message:"must be <= 1"};
if(vErrors === null){
vErrors = [err17];
}
else {
vErrors.push(err17);
}
errors++;
}
if(data3 < 0 || isNaN(data3)){
const err18 = {instancePath:instancePath+"/metalness",schemaPath:"#/properties/metalness/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err18];
}
else {
vErrors.push(err18);
}
errors++;
}
}
else {
const err19 = {instancePath:instancePath+"/metalness",schemaPath:"#/properties/metalness/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err19];
}
else {
vErrors.push(err19);
}
errors++;
}
}
if(data.opacity !== undefined){
let data4 = data.opacity;
if((typeof data4 == "number") && (isFinite(data4))){
if(data4 > 1 || isNaN(data4)){
const err20 = {instancePath:instancePath+"/opacity",schemaPath:"#/properties/opacity/maximum",keyword:"maximum",params:{comparison: "<=", limit: 1},message:"must be <= 1"};
if(vErrors === null){
vErrors = [err20];
}
else {
vErrors.push(err20);
}
errors++;
}
if(data4 <= 0 || isNaN(data4)){
const err21 = {instancePath:instancePath+"/opacity",schemaPath:"#/properties/opacity/exclusiveMinimum",keyword:"exclusiveMinimum",params:{comparison: ">", limit: 0},message:"must be > 0"};
if(vErrors === null){
vErrors = [err21];
}
else {
vErrors.push(err21);
}
errors++;
}
}
else {
const err22 = {instancePath:instancePath+"/opacity",schemaPath:"#/properties/opacity/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err22];
}
else {
vErrors.push(err22);
}
errors++;
}
}
if(data.transparent !== undefined){
if(typeof data.transparent !== "boolean"){
const err23 = {instancePath:instancePath+"/transparent",schemaPath:"#/properties/transparent/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};
if(vErrors === null){
vErrors = [err23];
}
else {
vErrors.push(err23);
}
errors++;
}
}
if(data.wireframe !== undefined){
if(typeof data.wireframe !== "boolean"){
const err24 = {instancePath:instancePath+"/wireframe",schemaPath:"#/properties/wireframe/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};
if(vErrors === null){
vErrors = [err24];
}
else {
vErrors.push(err24);
}
errors++;
}
}
if(data.flatShading !== undefined){
if(typeof data.flatShading !== "boolean"){
const err25 = {instancePath:instancePath+"/flatShading",schemaPath:"#/properties/flatShading/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};
if(vErrors === null){
vErrors = [err25];
}
else {
vErrors.push(err25);
}
errors++;
}
}
if(data.side !== undefined){
let data8 = data.side;
if(typeof data8 !== "string"){
const err26 = {instancePath:instancePath+"/side",schemaPath:"#/properties/side/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err26];
}
else {
vErrors.push(err26);
}
errors++;
}
if(!(((data8 === "front") || (data8 === "back")) || (data8 === "double"))){
const err27 = {instancePath:instancePath+"/side",schemaPath:"#/properties/side/enum",keyword:"enum",params:{allowedValues: schema86.properties.side.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err27];
}
else {
vErrors.push(err27);
}
errors++;
}
}
}
else {
const err28 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err28];
}
else {
vErrors.push(err28);
}
errors++;
}
validate55.errors = vErrors;
return errors === 0;
}
validate55.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};


function validate37(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate37.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(!(validate26(data, {instancePath,parentData,parentDataProperty,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate26.errors : vErrors.concat(validate26.errors);
errors = vErrors.length;
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.geometry === undefined){
const err0 = {instancePath,schemaPath:"#/allOf/1/required",keyword:"required",params:{missingProperty: "geometry"},message:"must have required property '"+"geometry"+"'"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(data.material === undefined){
const err1 = {instancePath,schemaPath:"#/allOf/1/required",keyword:"required",params:{missingProperty: "material"},message:"must have required property '"+"material"+"'"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
if(data.type !== undefined){
if("mesh" !== data.type){
const err2 = {instancePath:instancePath+"/type",schemaPath:"#/allOf/1/properties/type/const",keyword:"const",params:{allowedValue: "mesh"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
}
if(data.geometry !== undefined){
if(!(validate39(data.geometry, {instancePath:instancePath+"/geometry",parentData:data,parentDataProperty:"geometry",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate39.errors : vErrors.concat(validate39.errors);
errors = vErrors.length;
}
}
if(data.material !== undefined){
if(!(validate55(data.material, {instancePath:instancePath+"/material",parentData:data,parentDataProperty:"material",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate55.errors : vErrors.concat(validate55.errors);
errors = vErrors.length;
}
}
}
else {
const err3 = {instancePath,schemaPath:"#/allOf/1/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
if(data && typeof data == "object" && !Array.isArray(data)){
for(const key0 in data){
if((((((((((key0 !== "type") && (key0 !== "geometry")) && (key0 !== "material")) && (key0 !== "id")) && (key0 !== "name")) && (key0 !== "parentId")) && (key0 !== "visible")) && (key0 !== "locked")) && (key0 !== "transform")) && (key0 !== "editor")){
const err4 = {instancePath,schemaPath:"#/unevaluatedProperties",keyword:"unevaluatedProperties",params:{unevaluatedProperty: key0},message:"must NOT have unevaluated properties"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
}
}
else {
const err5 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
validate37.errors = vErrors;
return errors === 0;
}
validate37.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};


function validate24(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate24.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
const _errs0 = errors;
let valid0 = false;
let passing0 = null;
const _errs1 = errors;
if(!(validate25(data, {instancePath,parentData,parentDataProperty,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate25.errors : vErrors.concat(validate25.errors);
errors = vErrors.length;
}
var _valid0 = _errs1 === errors;
if(_valid0){
valid0 = true;
passing0 = 0;
var props0 = true;
}
const _errs2 = errors;
if(!(validate37(data, {instancePath,parentData,parentDataProperty,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate37.errors : vErrors.concat(validate37.errors);
errors = vErrors.length;
}
var _valid0 = _errs2 === errors;
if(_valid0 && valid0){
valid0 = false;
passing0 = [passing0, 1];
}
else {
if(_valid0){
valid0 = true;
passing0 = 1;
if(props0 !== true){
props0 = true;
}
}
}
if(!valid0){
const err0 = {instancePath,schemaPath:"#/oneOf",keyword:"oneOf",params:{passingSchemas: passing0},message:"must match exactly one schema in oneOf"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
else {
errors = _errs0;
if(vErrors !== null){
if(_errs0){
vErrors.length = _errs0;
}
else {
vErrors = null;
}
}
}
validate24.errors = vErrors;
evaluated0.props = props0;
return errors === 0;
}
validate24.evaluated = {"dynamicProps":true,"dynamicItems":false};


function validate23(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate23.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.objects === undefined){
const err0 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "objects"},message:"must have required property '"+"objects"+"'"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
for(const key0 in data){
if(!(key0 === "objects")){
const err1 = {instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
}
if(data.objects !== undefined){
let data0 = data.objects;
if(Array.isArray(data0)){
if(data0.length > 5000){
const err2 = {instancePath:instancePath+"/objects",schemaPath:"#/properties/objects/maxItems",keyword:"maxItems",params:{limit: 5000},message:"must NOT have more than 5000 items"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
const len0 = data0.length;
for(let i0=0; i0<len0; i0++){
if(!(validate24(data0[i0], {instancePath:instancePath+"/objects/" + i0,parentData:data0,parentDataProperty:i0,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate24.errors : vErrors.concat(validate24.errors);
errors = vErrors.length;
}
}
}
else {
const err3 = {instancePath:instancePath+"/objects",schemaPath:"#/properties/objects/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
}
}
else {
const err4 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
validate23.errors = vErrors;
return errors === 0;
}
validate23.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};


function validate20(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
/*# sourceURL="urn:forge-studio:schema:project:2" */;
let vErrors = null;
let errors = 0;
const evaluated0 = validate20.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.schemaVersion === undefined){
const err0 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "schemaVersion"},message:"must have required property '"+"schemaVersion"+"'"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(data.appVersion === undefined){
const err1 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "appVersion"},message:"must have required property '"+"appVersion"+"'"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
if(data.project === undefined){
const err2 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "project"},message:"must have required property '"+"project"+"'"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
if(data.settings === undefined){
const err3 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "settings"},message:"must have required property '"+"settings"+"'"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
if(data.scene === undefined){
const err4 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "scene"},message:"must have required property '"+"scene"+"'"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
for(const key0 in data){
if(!(((((key0 === "schemaVersion") || (key0 === "appVersion")) || (key0 === "project")) || (key0 === "settings")) || (key0 === "scene"))){
const err5 = {instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
}
if(data.schemaVersion !== undefined){
let data0 = data.schemaVersion;
if(!(((typeof data0 == "number") && (!(data0 % 1) && !isNaN(data0))) && (isFinite(data0)))){
const err6 = {instancePath:instancePath+"/schemaVersion",schemaPath:"#/properties/schemaVersion/type",keyword:"type",params:{type: "integer"},message:"must be integer"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
if(2 !== data0){
const err7 = {instancePath:instancePath+"/schemaVersion",schemaPath:"#/properties/schemaVersion/const",keyword:"const",params:{allowedValue: 2},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
}
if(data.appVersion !== undefined){
let data1 = data.appVersion;
if(typeof data1 === "string"){
if(func1(data1) > 40){
const err8 = {instancePath:instancePath+"/appVersion",schemaPath:"#/properties/appVersion/maxLength",keyword:"maxLength",params:{limit: 40},message:"must NOT have more than 40 characters"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
if(func1(data1) < 1){
const err9 = {instancePath:instancePath+"/appVersion",schemaPath:"#/properties/appVersion/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
if(!pattern4.test(data1)){
const err10 = {instancePath:instancePath+"/appVersion",schemaPath:"#/properties/appVersion/pattern",keyword:"pattern",params:{pattern: "^[0-9]+\\.[0-9]+\\.[0-9]+(?:-[0-9A-Za-z.-]+)?$"},message:"must match pattern \""+"^[0-9]+\\.[0-9]+\\.[0-9]+(?:-[0-9A-Za-z.-]+)?$"+"\""};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
}
else {
const err11 = {instancePath:instancePath+"/appVersion",schemaPath:"#/properties/appVersion/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
}
if(data.project !== undefined){
let data2 = data.project;
if(data2 && typeof data2 == "object" && !Array.isArray(data2)){
if(data2.name === undefined){
const err12 = {instancePath:instancePath+"/project",schemaPath:"#/$defs/projectMetadata/required",keyword:"required",params:{missingProperty: "name"},message:"must have required property '"+"name"+"'"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
if(data2.createdAt === undefined){
const err13 = {instancePath:instancePath+"/project",schemaPath:"#/$defs/projectMetadata/required",keyword:"required",params:{missingProperty: "createdAt"},message:"must have required property '"+"createdAt"+"'"};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
if(data2.updatedAt === undefined){
const err14 = {instancePath:instancePath+"/project",schemaPath:"#/$defs/projectMetadata/required",keyword:"required",params:{missingProperty: "updatedAt"},message:"must have required property '"+"updatedAt"+"'"};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
}
for(const key1 in data2){
if(!(((key1 === "name") || (key1 === "createdAt")) || (key1 === "updatedAt"))){
const err15 = {instancePath:instancePath+"/project",schemaPath:"#/$defs/projectMetadata/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key1},message:"must NOT have additional properties"};
if(vErrors === null){
vErrors = [err15];
}
else {
vErrors.push(err15);
}
errors++;
}
}
if(data2.name !== undefined){
let data3 = data2.name;
if(typeof data3 === "string"){
if(func1(data3) > 120){
const err16 = {instancePath:instancePath+"/project/name",schemaPath:"#/$defs/projectMetadata/properties/name/maxLength",keyword:"maxLength",params:{limit: 120},message:"must NOT have more than 120 characters"};
if(vErrors === null){
vErrors = [err16];
}
else {
vErrors.push(err16);
}
errors++;
}
if(func1(data3) < 1){
const err17 = {instancePath:instancePath+"/project/name",schemaPath:"#/$defs/projectMetadata/properties/name/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"};
if(vErrors === null){
vErrors = [err17];
}
else {
vErrors.push(err17);
}
errors++;
}
if(!pattern5.test(data3)){
const err18 = {instancePath:instancePath+"/project/name",schemaPath:"#/$defs/projectMetadata/properties/name/pattern",keyword:"pattern",params:{pattern: ".*\\S.*"},message:"must match pattern \""+".*\\S.*"+"\""};
if(vErrors === null){
vErrors = [err18];
}
else {
vErrors.push(err18);
}
errors++;
}
}
else {
const err19 = {instancePath:instancePath+"/project/name",schemaPath:"#/$defs/projectMetadata/properties/name/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err19];
}
else {
vErrors.push(err19);
}
errors++;
}
}
if(data2.createdAt !== undefined){
let data4 = data2.createdAt;
if(typeof data4 === "string"){
if(!(formats0.validate(data4))){
const err20 = {instancePath:instancePath+"/project/createdAt",schemaPath:"#/$defs/projectMetadata/properties/createdAt/format",keyword:"format",params:{format: "date-time"},message:"must match format \""+"date-time"+"\""};
if(vErrors === null){
vErrors = [err20];
}
else {
vErrors.push(err20);
}
errors++;
}
}
else {
const err21 = {instancePath:instancePath+"/project/createdAt",schemaPath:"#/$defs/projectMetadata/properties/createdAt/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err21];
}
else {
vErrors.push(err21);
}
errors++;
}
}
if(data2.updatedAt !== undefined){
let data5 = data2.updatedAt;
if(typeof data5 === "string"){
if(!(formats0.validate(data5))){
const err22 = {instancePath:instancePath+"/project/updatedAt",schemaPath:"#/$defs/projectMetadata/properties/updatedAt/format",keyword:"format",params:{format: "date-time"},message:"must match format \""+"date-time"+"\""};
if(vErrors === null){
vErrors = [err22];
}
else {
vErrors.push(err22);
}
errors++;
}
}
else {
const err23 = {instancePath:instancePath+"/project/updatedAt",schemaPath:"#/$defs/projectMetadata/properties/updatedAt/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err23];
}
else {
vErrors.push(err23);
}
errors++;
}
}
}
else {
const err24 = {instancePath:instancePath+"/project",schemaPath:"#/$defs/projectMetadata/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err24];
}
else {
vErrors.push(err24);
}
errors++;
}
}
if(data.settings !== undefined){
if(!(validate21(data.settings, {instancePath:instancePath+"/settings",parentData:data,parentDataProperty:"settings",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate21.errors : vErrors.concat(validate21.errors);
errors = vErrors.length;
}
}
if(data.scene !== undefined){
if(!(validate23(data.scene, {instancePath:instancePath+"/scene",parentData:data,parentDataProperty:"scene",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate23.errors : vErrors.concat(validate23.errors);
errors = vErrors.length;
}
}
}
else {
const err25 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err25];
}
else {
vErrors.push(err25);
}
errors++;
}
validate20.errors = vErrors;
return errors === 0;
}
validate20.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

