'use client'

import React, { useEffect } from 'react'
import { useField, FieldLabel } from '@payloadcms/ui'
import { GoogleMap, Marker, LoadScript, StandaloneSearchBox } from '@react-google-maps/api'
import { Input } from '@/components/ui/input'

const containerStyle = {
  width: '100%',
  height: '400px'
}

const defaultCenter = {
  lat: 39.9042,
  lng: 116.4074
}

export const LocationPicker: React.FC<{
  path: string
  field: {
    label?: string
    required?: boolean
  }
}> = ({ path, field: { label, required } }) => {
  const { value, setValue } = useField<{
    lat: number
    lng: number
    address?: string
  }>({ path })

  const [map, setMap] = React.useState<google.maps.Map | null>(null)
  const [searchBox, setSearchBox] = React.useState<google.maps.places.SearchBox | null>(null)
  const [marker, setMarker] = React.useState<google.maps.LatLng | null>(null)

  const onLoad = React.useCallback((map: google.maps.Map) => {
    setMap(map)
  }, [])

  const onLoadSearchBox = React.useCallback((searchBox: google.maps.places.SearchBox) => {
    setSearchBox(searchBox)
  }, [])

  const onPlacesChanged = React.useCallback(() => {
    if (searchBox) {
      const places = searchBox.getPlaces()
      if (places && places.length > 0) {
        const place = places[0]
        const location = place.geometry?.location
        if (location) {
          map?.panTo(location)
          setMarker(location)
          setValue({
            lat: location.lat(),
            lng: location.lng(),
            address: place.formatted_address
          })
        }
      }
    }
  }, [searchBox, map, setValue])

  const onMapClick = React.useCallback((e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      setMarker(e.latLng)
      setValue({
        lat: e.latLng.lat(),
        lng: e.latLng.lng()
      })
    }
  }, [setValue])

  return (
    <div className="field-type">
      <FieldLabel
        htmlFor={path}
        label={label}
        required={required}
      />
      <LoadScript
        googleMapsApiKey={'AIzaSyBEgH-gl2hIGDunTbdoS1CXJ68qbfLRNMA'}
        libraries={['places']}
      >
        <div className="space-y-4">
          <StandaloneSearchBox onLoad={onLoadSearchBox} onPlacesChanged={onPlacesChanged}>
            <Input type="text" placeholder="搜索地址..." />
          </StandaloneSearchBox>
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={value ? { lat: value.lat, lng: value.lng } : defaultCenter}
            zoom={13}
            onLoad={onLoad}
            onClick={onMapClick}
          >
            {marker && (
              <Marker
                position={{
                  lat: marker.lat(),
                  lng: marker.lng()
                }}
              />
            )}
          </GoogleMap>
          {value && (
            <div className="text-sm text-muted-foreground">
              <div>纬度: {value.lat}</div>
              <div>经度: {value.lng}</div>
              {value.address && <div>地址: {value.address}</div>}
            </div>
          )}
        </div>
      </LoadScript>
    </div>
  )
}

export default LocationPicker
