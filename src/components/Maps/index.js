import React, { Component, createRef } from 'react';
import "@tomtom-international/web-sdk-maps/dist/maps.css";
import * as tt from "@tomtom-international/web-sdk-maps";
// import mapSDK from '@tomtom-international/web-sdk-maps';
import { services } from "@tomtom-international/web-sdk-services";
const apiKey = 'niok0hn1JP1wKvqfmdgci0upSxUgSszm'
const mapZoom = 13;
const mapLongitude = 83.3732
const mapLatitude = 26.7606
export class Maps extends Component {
    constructor(props) {
        super(props)
        

        this.mapRef = createRef()
        this.state = {
            data : [],
            markers: []
        }
    }
    addMarker = (e) => {
        const { markers} = this.state
        
        if (markers.length < 2) {
            const marker = new tt.Marker().setLngLat(e.lngLat).addTo(this.map);
            // console.log(marker,"aaaaaaaaaaaaaaaaaaaaaaa")
            this.setState({ ...this.state,markers: [...markers, marker] })
        }
    }
    handleMarker = (e) => {
        console.log(this.state,"mmmmmm")
        const { markers,data } = this.state
        if (markers.length <= data?.length) {
            const marker = data?.map((curr) =>{
                console.log(curr)
                const val = new tt.Marker().setLngLat([curr.longitude, curr.latitude]).addTo(this.map);
                var popupOffsets = {
                    bottom: [0, -40]
                }
                var popup = new tt.Popup({ offset: popupOffsets }).setHTML(curr.name);
                val.setPopup(popup);
                return val;
            })
            this.setState({...this.state, markers: [...markers, ...marker] })
        }
    }
    route = () => {
        const { markers } = this.state;
        console.log(markers,"")
        if (markers.length < 2) return;

        const key = apiKey;
        const locations = markers.map((marker) =>{ 
            console.log(marker)
            return marker.getLngLat()
        });

        this.calculateRoute("red", {
            key,
            locations,
            travelMode: "bus",
            vehicleLoadType: "otherHazmatExplosive",
            vehicleWeight: 8000
        });
        this.calculateRoute("green", {
            key,
            locations
        });
    };

    calculateRoute = async (color, routeOptions) => {
        try {
            const response = await services.calculateRoute(routeOptions);
            const geojson = response.toGeoJson();

            this.map.addLayer({
                id: color,
                type: "line",
                source: {
                    type: "geojson",
                    data: geojson
                },
                paint: {
                    "line-color": color,
                    "line-width": 6
                }
            });
        } catch (error) {
            console.error(error);
        }
    };

    clear = () => {
        const { markers } = this.state;
    
        markers.forEach((marker) => marker.remove());
        this.setState({...this.state, markers: [] });
    
        this.removeRoute("green");
        this.removeRoute("red");
    };
    
    removeRoute = (id) => {
        this.map.removeLayer(id);
        this.map.removeSource(id);
    };


    componentDidMount() {
        const param = window.location.pathname.substring(11);
        const values = JSON.parse(localStorage.getItem('data'))
        const filterData = values.filter(curr => curr.routeId === param)
        const stopList = filterData.map(curr => curr.stopList)
        // console.log(filterData,stopList,"ffffffff")
        this.setState({...this.state, data : stopList[0]})
        this.map = tt.map({
            key: apiKey,
            container: this.mapRef.current,
            center: [mapLongitude, mapLatitude],
            zoom: mapZoom
        })
        this.map.on("click", this.addMarker)
        // let locationMarkerSrc = new mapSDK.Marker({
        //     draggable: false
        // }).setLngLat([mapLongitude, mapLatitude]).addTo(this.map);
        // let locationMarkerDest = new mapSDK.Marker({
        //     draggable: false
        // }).setLngLat([mapLongitudeDest, mapLatitudeDest]).addTo(this.map);
    }
    componentWillUnmount() {
        this.map.remove()
    }
    render() {
        return (
            <div ref={this.mapRef} style={{ height: '595px', width: '100%', marginTop: '-2%' }}>
                <button style={{ position: 'absolute', top: '10px', left: '5px', zIndex: 10 ,padding : '10px', color : 'white',width : '100px',backgroundColor : '#8f48c9' ,border : 'none' ,borderRadius : '5px' }} onClick={this.handleMarker}>
                    Show Marker
                </button>
                <button style={{ position: 'absolute', top: '10px', left: '120px', zIndex: 10, width : '80px', padding : '10px', color : 'white',backgroundColor : '#8f48c9' ,border : 'none' ,borderRadius : '5px' }} onClick={this.route}>
                    Route
                </button>
                <button style={{ position: 'absolute', top: '10px', left: '220px', zIndex: 10, width : '80px',padding : '10px', color : 'white' , backgroundColor : '#8f48c9' ,border : 'none' ,borderRadius : '5px' }} onClick={this.clear}>
                    Clear
                </button>
            </div>

        )
    }
}

export default Maps