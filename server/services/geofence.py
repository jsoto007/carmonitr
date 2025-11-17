import math

RADIUS_EARTH_METERS = 6_371_000

def is_within_geofence(lat: float, lon: float, center_lat: float, center_lon: float, radius: float) -> bool:
    dlat = math.radians(center_lat - lat)
    dlon = math.radians(center_lon - lon)
    a = math.sin(dlat / 2) ** 2 + math.cos(math.radians(lat)) * math.cos(math.radians(center_lat)) * math.sin(dlon / 2) ** 2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return (RADIUS_EARTH_METERS * c) <= radius
