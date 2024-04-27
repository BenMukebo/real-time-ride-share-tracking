type StopSchema = { location: { lat: number; lng: number }; label: string };

// Starting Point: Nyabugogo
export const center = { lat: -1.939826787816454, lng: 30.0445426438232 };

// Intermediate Stops
export const intermediateStops = [
  {
    location: { lat: -1.9355377074007851, lng: 30.060163829002217 },
    label: "Stop A",
  },
  {
    location: { lat: -1.9358808342336546, lng: 30.08024820994666 },
    label: "Stop B",
  },
  {
    location: { lat: -1.9489196023037583, lng: 30.092607828989397 },
    label: "Stop C",
  },
  {
    location: { lat: -1.9592132952818164, lng: 30.106684061788073 },
    label: "Stop D",
  },
  {
    location: { lat: -1.9487480402200394, lng: 30.126596781356923 },
    label: "Stop E",
  },
];

// Ending Point: Kimironko
export const endingPoint: StopSchema = {
  location: { lat: -1.9365670876910166, lng: 30.13020167024439 },
  label: "Kimironko",
};

export const stops: StopSchema[] = [
  { location: center, label: "Nyabugogo" },
  ...intermediateStops,
  endingPoint,
];
