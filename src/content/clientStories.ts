/**
 * Client stories shown in the home page's client journey carousel when the
 * CMS has none, and used as the admin editor's starting point.
 *
 * TODO(owner): replace with verified client testimonials. These entries are
 * placeholders carried over from the original site: the names, locations and
 * quotes have not been confirmed with real clients. Do not mark them up as
 * reviews (schema.org Review / AggregateRating) until they are verified.
 */

export type ClientStory = {
  id: string;
  name: string;
  location: string;
  testimonial: string;
  videoUrl: string;
  /** [longitude, latitude] of the installation, for the map pin. */
  coords: [number, number];
};

export const DEFAULT_CLIENT_STORIES: readonly ClientStory[] = Object.freeze([
  { id: "1", name: "Santos Family", location: "Quezon City, Metro Manila", testimonial: "Our Meralco bill dropped by 87% in the first month. The team handled the entire Net-Metering application perfectly, and now we literally earn credits while we sleep. It's the best investment we've made for our home's future.", videoUrl: "", coords: [121.05, 14.68] },
  { id: "2", name: "Cruz Commercial", location: "Cebu City, Cebu", testimonial: "Operating costs dropped significantly since we installed our solar array. The team handled everything from permits to final inspection. Our system gives us enough buffer even through the peak season.", videoUrl: "", coords: [123.90, 10.32] },
  { id: "3", name: "Reyes Residence", location: "Davao City, Davao del Sur", testimonial: "We were skeptical at first, but the numbers don't lie. Within 18 months we recovered a significant portion of our investment. The monitoring app lets us see exactly how much we save in real time.", videoUrl: "", coords: [125.61, 7.07] },
  { id: "4", name: "De Leon Residence", location: "Angeles City, Pampanga", testimonial: "Professional installation completed in just two days. Our home now runs entirely on solar during daytime hours. We highly recommend Azari to anyone considering the switch to renewable energy.", videoUrl: "", coords: [120.59, 15.15] },
  { id: "5", name: "Garcia Business", location: "Iloilo City, Iloilo", testimonial: "As a business owner, the ROI was clear from the start. Our electricity expenses went from our highest operating cost to nearly negligible. The after-sales support has been exceptional as well.", videoUrl: "", coords: [122.57, 10.72] },
  { id: "6", name: "Torres Family", location: "Batangas City, Batangas", testimonial: "Consistent monthly savings since day one. The process from quotation to installation was seamless, and the monitoring app keeps us informed about our energy generation at all times.", videoUrl: "", coords: [121.05, 13.76] },
  { id: "7", name: "Chua Enterprise", location: "Cagayan de Oro, Misamis Oriental", testimonial: "We installed a 50kWp commercial system across our warehouse rooftops. The project was completed on schedule and within budget. We're already planning to expand to our other facilities.", videoUrl: "", coords: [124.63, 8.48] },
]);
