"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

type CheckInMapProps = {
  siteLat: number;
  siteLng: number;
  checkLat: number;
  checkLng: number;
  distanceMeters: number;
};

function makeDotIcon(color: string) {
  return L.divIcon({
    className: "",
    html: `<span style="display:block;width:14px;height:14px;border-radius:9999px;background:${color};border:2px solid white;box-shadow:0 0 0 1px rgba(0,0,0,0.25)"></span>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });
}

export function CheckInMap({
  siteLat,
  siteLng,
  checkLat,
  checkLng,
  distanceMeters,
}: CheckInMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      zoomControl: false,
      attributionControl: false,
      scrollWheelZoom: false,
    });
    mapRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
    }).addTo(map);

    const siteIcon = makeDotIcon("var(--foreground)");
    const checkIcon = makeDotIcon("var(--primary)");

    L.marker([siteLat, siteLng], { icon: siteIcon })
      .addTo(map)
      .bindTooltip("จุดที่กำหนด (มุมร้าน)");
    L.marker([checkLat, checkLng], { icon: checkIcon }).addTo(map).bindTooltip("จุดเช็คอินจริง");

    L.polyline(
      [
        [siteLat, siteLng],
        [checkLat, checkLng],
      ],
      { color: "var(--primary)", weight: 2, dashArray: "4 4" },
    ).addTo(map);

    const bounds = L.latLngBounds([
      [siteLat, siteLng],
      [checkLat, checkLng],
    ]);
    map.fitBounds(bounds.pad(0.6), { maxZoom: 17 });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [siteLat, siteLng, checkLat, checkLng]);

  return (
    <div className="border-border overflow-hidden rounded-md border">
      <div ref={containerRef} className="h-40 w-full" />
      <div className="bg-muted flex items-center justify-between px-2 py-1.5 text-[10px]">
        <span className="text-muted-foreground">
          จุดที่กำหนด {siteLat.toFixed(5)}, {siteLng.toFixed(5)}
        </span>
        <span className="text-foreground font-semibold">{distanceMeters}m</span>
        <span className="text-muted-foreground">
          เช็คอินจริง {checkLat.toFixed(5)}, {checkLng.toFixed(5)}
        </span>
      </div>
    </div>
  );
}
