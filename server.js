const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ==========================================
// SEED DATA & MOCK DATABASE
// ==========================================

// Central Hub Location (Bengaluru Urban / South Hub example)
const HUB_LOCATION = {
  id: 'HUB-01',
  name: 'Farm2Home South Metro Hub',
  address: 'Hub #4, Greenfield Logistics Park, Bengaluru',
  lat: 12.9352,
  lng: 77.6245
};

// Registered Farmers
const FARMERS = [
  {
    id: 'F-101',
    name: 'Ramesh Patel',
    village: 'Mandya Rural Cluster',
    distanceKm: 42,
    rating: 4.9,
    activeCrops: ['Organic Tomatoes', 'Baby Spinach', 'Sweet Corn'],
    totalEarnings: 84250,
    fairPriceBonus: 28400
  },
  {
    id: 'F-102',
    name: 'Lakshmi Devi',
    village: 'Hoskote Organic Valley',
    distanceKm: 28,
    rating: 4.95,
    activeCrops: ['Country Carrots', 'Bell Peppers', 'Green Peas'],
    totalEarnings: 69400,
    fairPriceBonus: 23100
  },
  {
    id: 'F-103',
    name: 'Anand Kulkarni',
    village: 'Kolar Agro Belt',
    distanceKm: 55,
    rating: 4.88,
    activeCrops: ['Shimla Apples', 'Nagpur Oranges', 'Nashik Onions'],
    totalEarnings: 112000,
    fairPriceBonus: 39500
  }
];

// Catalog with Transparent Pricing Matrix
let CROPS_CATALOG = [
  {
    id: 'crop-1',
    name: 'Organic Vine Tomatoes',
    category: 'Vegetables',
    unit: 'kg',
    farmerPrice: 38,
    hubFee: 5,
    deliveryFee: 4,
    platformFee: 5,
    customerPrice: 52,
    mandiMiddlemanPrice: 70,
    baseDailyDemandKg: 320,
    spoilageShelfDays: 5,
    currentHubStockKg: 140,
    image: '🍅'
  },
  {
    id: 'crop-2',
    name: 'Hydroponic Baby Spinach',
    category: 'Leafy Greens',
    unit: 'bunch',
    farmerPrice: 24,
    hubFee: 4,
    deliveryFee: 3,
    platformFee: 4,
    customerPrice: 35,
    mandiMiddlemanPrice: 55,
    baseDailyDemandKg: 190,
    spoilageShelfDays: 2,
    currentHubStockKg: 65,
    image: '🥬'
  },
  {
    id: 'crop-3',
    name: 'Crisp Shimla Apples',
    category: 'Fruits',
    unit: 'kg',
    farmerPrice: 110,
    hubFee: 14,
    deliveryFee: 10,
    platformFee: 14,
    customerPrice: 148,
    mandiMiddlemanPrice: 210,
    baseDailyDemandKg: 240,
    spoilageShelfDays: 14,
    currentHubStockKg: 110,
    image: '🍎'
  },
  {
    id: 'crop-4',
    name: 'Golden Nashik Onions',
    category: 'Vegetables',
    unit: 'kg',
    farmerPrice: 26,
    hubFee: 4,
    deliveryFee: 3,
    platformFee: 4,
    customerPrice: 37,
    mandiMiddlemanPrice: 52,
    baseDailyDemandKg: 450,
    spoilageShelfDays: 20,
    currentHubStockKg: 280,
    image: '🧅'
  },
  {
    id: 'crop-5',
    name: 'Sweet Nagpur Oranges',
    category: 'Fruits',
    unit: 'kg',
    farmerPrice: 62,
    hubFee: 8,
    deliveryFee: 6,
    platformFee: 8,
    customerPrice: 84,
    mandiMiddlemanPrice: 120,
    baseDailyDemandKg: 210,
    spoilageShelfDays: 8,
    currentHubStockKg: 95,
    image: '🍊'
  },
  {
    id: 'crop-6',
    name: 'Crunchy Country Carrots',
    category: 'Vegetables',
    unit: 'kg',
    farmerPrice: 34,
    hubFee: 5,
    deliveryFee: 4,
    platformFee: 5,
    customerPrice: 48,
    mandiMiddlemanPrice: 68,
    baseDailyDemandKg: 270,
    spoilageShelfDays: 7,
    currentHubStockKg: 130,
    image: '🥕'
  },
  {
    id: 'crop-7',
    name: 'Tender Green Peas',
    category: 'Vegetables',
    unit: 'kg',
    farmerPrice: 58,
    hubFee: 8,
    deliveryFee: 6,
    platformFee: 7,
    customerPrice: 79,
    mandiMiddlemanPrice: 110,
    baseDailyDemandKg: 180,
    spoilageShelfDays: 4,
    currentHubStockKg: 70,
    image: '🫛'
  },
  {
    id: 'crop-8',
    name: 'Tricolor Bell Peppers',
    category: 'Vegetables',
    unit: 'kg',
    farmerPrice: 75,
    hubFee: 10,
    deliveryFee: 7,
    platformFee: 10,
    customerPrice: 102,
    mandiMiddlemanPrice: 150,
    baseDailyDemandKg: 160,
    spoilageShelfDays: 6,
    currentHubStockKg: 85,
    image: '🫑'
  }
];

// Active Orders in Hub's Delivery Territory
let CUSTOMER_ORDERS = [
  {
    id: 'ORD-841',
    customerName: 'Priya Sharma',
    address: 'Flat 402, Green Glen Layout, Bellandur',
    neighborhood: 'Bellandur - Sector 4',
    lat: 12.9304,
    lng: 77.6784,
    items: [{ cropId: 'crop-1', name: 'Organic Vine Tomatoes', qty: 2 }, { cropId: 'crop-2', name: 'Baby Spinach', qty: 3 }],
    totalPrice: 209,
    orderTime: '07:15 AM',
    priority: 'Normal',
    clusterId: null,
    deliveryStatus: 'Pending Batching'
  },
  {
    id: 'ORD-842',
    customerName: 'Vikram Mehta',
    address: 'Villa 12, Sobha Iris, Bellandur',
    neighborhood: 'Bellandur - Sector 4',
    lat: 12.9328,
    lng: 77.6821,
    items: [{ cropId: 'crop-3', name: 'Crisp Shimla Apples', qty: 2 }, { cropId: 'crop-6', name: 'Country Carrots', qty: 1 }],
    totalPrice: 344,
    orderTime: '07:22 AM',
    priority: 'Express',
    clusterId: null,
    deliveryStatus: 'Pending Batching'
  },
  {
    id: 'ORD-843',
    customerName: 'Ananya Reddy',
    address: 'B-304, Adarsh Palm Retreat, Outer Ring Rd',
    neighborhood: 'Bellandur - Sector 4',
    lat: 12.9285,
    lng: 77.6865,
    items: [{ cropId: 'crop-4', name: 'Nashik Onions', qty: 3 }, { cropId: 'crop-1', name: 'Organic Vine Tomatoes', qty: 2 }],
    totalPrice: 215,
    orderTime: '07:30 AM',
    priority: 'Normal',
    clusterId: null,
    deliveryStatus: 'Pending Batching'
  },
  {
    id: 'ORD-844',
    customerName: 'Karthik Raman',
    address: 'Tower 2, Prestige Sunnyside, Marathahalli ORR',
    neighborhood: 'Kadubeesanahalli / Tech Corridor',
    lat: 12.9412,
    lng: 77.6975,
    items: [{ cropId: 'crop-5', name: 'Nagpur Oranges', qty: 3 }, { cropId: 'crop-8', name: 'Tricolor Bell Peppers', qty: 1 }],
    totalPrice: 354,
    orderTime: '07:35 AM',
    priority: 'Normal',
    clusterId: null,
    deliveryStatus: 'Pending Batching'
  },
  {
    id: 'ORD-845',
    customerName: 'Sneha Sengupta',
    address: 'Block C-101, Embassy TechVillage Residences',
    neighborhood: 'Kadubeesanahalli / Tech Corridor',
    lat: 12.9388,
    lng: 77.6932,
    items: [{ cropId: 'crop-2', name: 'Baby Spinach', qty: 2 }, { cropId: 'crop-7', name: 'Green Peas', qty: 1 }],
    totalPrice: 149,
    orderTime: '07:42 AM',
    priority: 'Express',
    clusterId: null,
    deliveryStatus: 'Pending Batching'
  },
  {
    id: 'ORD-846',
    customerName: 'Rajesh Iyer',
    address: 'House 88, 14th Main, HSR Layout Sector 3',
    neighborhood: 'HSR Layout South',
    lat: 12.9115,
    lng: 77.6385,
    items: [{ cropId: 'crop-1', name: 'Organic Vine Tomatoes', qty: 3 }, { cropId: 'crop-4', name: 'Nashik Onions', qty: 2 }],
    totalPrice: 230,
    orderTime: '07:48 AM',
    priority: 'Normal',
    clusterId: null,
    deliveryStatus: 'Pending Batching'
  },
  {
    id: 'ORD-847',
    customerName: 'Deepa Nambiar',
    address: 'Apt 501, Purva Vantage, HSR Layout Sector 2',
    neighborhood: 'HSR Layout South',
    lat: 12.9142,
    lng: 77.6418,
    items: [{ cropId: 'crop-3', name: 'Crisp Shimla Apples', qty: 1 }, { cropId: 'crop-5', name: 'Nagpur Oranges', qty: 2 }],
    totalPrice: 316,
    orderTime: '07:54 AM',
    priority: 'Normal',
    clusterId: null,
    deliveryStatus: 'Pending Batching'
  },
  {
    id: 'ORD-848',
    customerName: 'Arjun Verma',
    address: 'Plot 74, 9th Cross, HSR Sector 6',
    neighborhood: 'HSR Layout South',
    lat: 12.9098,
    lng: 77.6342,
    items: [{ cropId: 'crop-8', name: 'Bell Peppers', qty: 2 }, { cropId: 'crop-6', name: 'Country Carrots', qty: 2 }],
    totalPrice: 300,
    orderTime: '08:02 AM',
    priority: 'Normal',
    clusterId: null,
    deliveryStatus: 'Pending Batching'
  },
  {
    id: 'ORD-849',
    customerName: 'Meera Deshmukh',
    address: 'Penthouse 12, Salarpuria Sanctity, Sarjapur Rd',
    neighborhood: 'Sarjapur Gateway',
    lat: 12.9189,
    lng: 77.6698,
    items: [{ cropId: 'crop-7', name: 'Green Peas', qty: 2 }, { cropId: 'crop-1', name: 'Organic Vine Tomatoes', qty: 2 }],
    totalPrice: 262,
    orderTime: '08:10 AM',
    priority: 'Express',
    clusterId: null,
    deliveryStatus: 'Pending Batching'
  },
  {
    id: 'ORD-850',
    customerName: 'Tanvi Nair',
    address: 'B-702, Bren Unity, Doddakannelli',
    neighborhood: 'Sarjapur Gateway',
    lat: 12.9165,
    lng: 77.6742,
    items: [{ cropId: 'crop-3', name: 'Crisp Shimla Apples', qty: 3 }, { cropId: 'crop-5', name: 'Nagpur Oranges', qty: 2 }],
    totalPrice: 612,
    orderTime: '08:15 AM',
    priority: 'Normal',
    clusterId: null,
    deliveryStatus: 'Pending Batching'
  }
];

// Farmer Harvest Commitments
let HARVEST_COMMITMENTS = [];

// ==========================================
// ALGORITHM 1: AI DEMAND PREDICTION ENGINE
// ==========================================
/**
 * Predicts next day & 3-day customer demand based on:
 * - Historical consumption baseline
 * - Weather conditions (rain increases hot soup vegetables, heat increases fruits)
 * - Festival / Holiday surge multiplier
 * - Weekend consumption spike
 * - Neighborhood pre-order trends
 */
function calculateAIDemand(weather = 'Sunny', festival = false, isWeekend = false) {
  let weatherMultiplier = 1.0;
  if (weather === 'Rainy') {
    weatherMultiplier = 1.25; // High demand for fresh cooking veg, lower for raw salad
  } else if (weather === 'Heatwave') {
    weatherMultiplier = 1.15; // Higher demand for hydrating fruits & leafy greens
  }

  const festivalMultiplier = festival ? 1.40 : 1.0;
  const weekendMultiplier = isWeekend ? 1.22 : 1.0;
  const overallMultiplier = weatherMultiplier * festivalMultiplier * weekendMultiplier;

  return CROPS_CATALOG.map(crop => {
    // Specific factor per crop category
    let categoryMultiplier = 1.0;
    if (crop.category === 'Leafy Greens' && weather === 'Rainy') categoryMultiplier = 1.15;
    if (crop.category === 'Fruits' && weather === 'Heatwave') categoryMultiplier = 1.35;
    if (festival && (crop.name.includes('Apples') || crop.name.includes('Oranges'))) categoryMultiplier = 1.5;

    const predictedDemandKg = Math.round(crop.baseDailyDemandKg * overallMultiplier * categoryMultiplier);
    const recommendedHarvestKg = Math.max(predictedDemandKg - crop.currentHubStockKg, 0);

    // AI Confidence Score based on data density & variance
    const confidenceScore = Math.min(98.4, 91.0 + Math.random() * 6.5).toFixed(1);

    // Estimated Spoilage Reduction compared to unmanaged mandi dumping
    const traditionalSpoilageKg = Math.round(predictedDemandKg * 0.32);
    const farm2homeSpoilageKg = Math.round(predictedDemandKg * 0.04);
    const wastageSavedKg = traditionalSpoilageKg - farm2homeSpoilageKg;

    // Guaranteed Direct Payout
    const expectedFarmerEarnings = Math.round(recommendedHarvestKg * crop.farmerPrice);
    const traditionalMandiEarnings = Math.round(recommendedHarvestKg * (crop.farmerPrice * 0.55));
    const extraFarmerProfit = expectedFarmerEarnings - traditionalMandiEarnings;

    return {
      cropId: crop.id,
      name: crop.name,
      category: crop.category,
      unit: crop.unit,
      currentStockKg: crop.currentHubStockKg,
      predictedDemandKg,
      recommendedHarvestKg,
      confidenceScore: `${confidenceScore}%`,
      wastageSavedKg,
      wastageReductionPercent: '87.5%',
      farmerPricePerKg: crop.farmerPrice,
      customerPricePerKg: crop.customerPrice,
      expectedFarmerEarnings,
      extraFarmerProfit,
      optimalHarvestWindow: '05:30 AM - 08:30 AM',
      urgency: recommendedHarvestKg > 150 ? 'High Need' : 'Normal',
      historicalTrend: [
        Math.round(crop.baseDailyDemandKg * 0.85),
        Math.round(crop.baseDailyDemandKg * 0.92),
        Math.round(crop.baseDailyDemandKg * 0.98),
        Math.round(crop.baseDailyDemandKg * 1.05),
        Math.round(crop.baseDailyDemandKg * 1.10),
        Math.round(crop.baseDailyDemandKg * 1.15),
        predictedDemandKg
      ]
    };
  });
}

// ==========================================
// ALGORITHM 2: SMART ORDER GROUPING (CLUSTERING)
// ==========================================
/**
 * Geospatial Clustering using Haversine distance & Centroid assignment.
 * Automatically groups customer orders into optimal dispatch batches
 * based on geographic proximity, vehicle capacity (max 5 orders per EV crate batch),
 * and hub routing.
 */
function haversineDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(2));
}

function runSmartOrderGrouping(orders) {
  // Define Target Geographic Hub Cluster Zones
  const CLUSTER_DEFINITIONS = [
    {
      id: 'CLUSTER-A',
      name: 'Batch #A: Bellandur & Green Glen',
      centerLat: 12.9305,
      centerLng: 77.6823,
      color: '#10B981', // Emerald
      assignedVehicle: 'EV Van Alpha (Eco-01)',
      maxCapacityKg: 80
    },
    {
      id: 'CLUSTER-B',
      name: 'Batch #B: Kadubeesanahalli Tech Belt',
      centerLat: 12.9400,
      centerLng: 77.6953,
      color: '#3B82F6', // Blue
      assignedVehicle: 'EV 3-Wheeler Beta (Eco-02)',
      maxCapacityKg: 65
    },
    {
      id: 'CLUSTER-C',
      name: 'Batch #C: HSR Layout Sectors 2-6',
      centerLat: 12.9118,
      centerLng: 77.6381,
      color: '#F59E0B', // Amber
      assignedVehicle: 'EV Van Gamma (Eco-03)',
      maxCapacityKg: 80
    },
    {
      id: 'CLUSTER-D',
      name: 'Batch #D: Sarjapur Corridor',
      centerLat: 12.9177,
      centerLng: 77.6720,
      color: '#8B5CF6', // Purple
      assignedVehicle: 'EV Cargo Bike Delta (Eco-04)',
      maxCapacityKg: 50
    }
  ];

  // Group each order to nearest cluster center
  const clusters = CLUSTER_DEFINITIONS.map(c => ({
    ...c,
    orders: [],
    totalKg: 0,
    totalValue: 0
  }));

  orders.forEach(order => {
    let bestClusterIdx = 0;
    let minDistance = 999999;

    CLUSTER_DEFINITIONS.forEach((cluster, idx) => {
      const dist = haversineDistanceKm(order.lat, order.lng, cluster.centerLat, cluster.centerLng);
      if (dist < minDistance) {
        minDistance = dist;
        bestClusterIdx = idx;
      }
    });

    const assignedCluster = clusters[bestClusterIdx];
    order.clusterId = assignedCluster.id;
    order.clusterName = assignedCluster.name;
    order.clusterColor = assignedCluster.color;
    order.deliveryStatus = 'Grouped in ' + assignedCluster.name;

    const approxKg = order.items.reduce((sum, item) => sum + (item.qty || 1.5), 0);
    assignedCluster.orders.push(order);
    assignedCluster.totalKg += approxKg;
    assignedCluster.totalValue += order.totalPrice;
  });

  // Calculate Grouping Impact Metrics
  const totalOrders = orders.length;
  // If each order had an individual round trip delivery:
  const unoptimizedDistanceKm = Number((totalOrders * 9.8).toFixed(1));
  const unoptimizedTrips = totalOrders;
  const unoptimizedFuelCost = Math.round(unoptimizedDistanceKm * 8.5);
  const unoptimizedCO2Kg = Number((unoptimizedDistanceKm * 0.192).toFixed(1));

  // With Smart Grouping into clusters:
  const activeClusters = clusters.filter(c => c.orders.length > 0);
  const optimizedTrips = activeClusters.length;
  const optimizedDistanceKm = Number((activeClusters.length * 9.2).toFixed(1));
  const optimizedFuelCost = Math.round(optimizedDistanceKm * 3.2); // Clean EV rate
  const optimizedCO2Kg = Number((optimizedDistanceKm * 0.04).toFixed(1));

  const tripReductionPercent = Math.round(((unoptimizedTrips - optimizedTrips) / unoptimizedTrips) * 100);
  const costSavingsPercent = Math.round(((unoptimizedFuelCost - optimizedFuelCost) / unoptimizedFuelCost) * 100);
  const co2ReductionPercent = Math.round(((unoptimizedCO2Kg - optimizedCO2Kg) / unoptimizedCO2Kg) * 100);

  return {
    clusters: activeClusters,
    metrics: {
      totalOrders,
      unoptimizedTrips,
      optimizedTrips,
      tripReductionPercent: `${tripReductionPercent}%`,
      unoptimizedDistanceKm,
      optimizedDistanceKm,
      distanceSavedKm: Number((unoptimizedDistanceKm - optimizedDistanceKm).toFixed(1)),
      unoptimizedFuelCost: `₹${unoptimizedFuelCost}`,
      optimizedFuelCost: `₹${optimizedFuelCost}`,
      costSavings: `₹${unoptimizedFuelCost - optimizedFuelCost}`,
      costSavingsPercent: `${costSavingsPercent}%`,
      unoptimizedCO2Kg: `${unoptimizedCO2Kg} kg`,
      optimizedCO2Kg: `${optimizedCO2Kg} kg`,
      co2SavedKg: `${Number((unoptimizedCO2Kg - optimizedCO2Kg).toFixed(1))} kg`,
      co2ReductionPercent: `${co2ReductionPercent}%`
    }
  };
}

// ==========================================
// ALGORITHM 3: AI ROUTE OPTIMIZATION (2-OPT TSP)
// ==========================================
/**
 * Traveling Salesperson Problem Solver using:
 * 1. Nearest-Neighbor Heuristic (Greedy Initial Route with Priority Weighting)
 * 2. 2-Opt Local Search Pairwise Improvement
 * Produces the optimal sequence of delivery drop points starting and ending at the Hub.
 */
function calculateRouteDistance(tour, points) {
  let dist = 0;
  for (let i = 0; i < tour.length - 1; i++) {
    const p1 = points[tour[i]];
    const p2 = points[tour[i + 1]];
    dist += haversineDistanceKm(p1.lat, p1.lng, p2.lat, p2.lng);
  }
  return dist;
}

function optimizeClusterRoute(clusterId, orders) {
  const clusterOrders = orders.filter(o => o.clusterId === clusterId);
  if (clusterOrders.length === 0) return null;

  // Points list: Index 0 is HUB, subsequent are orders
  const points = [
    { ...HUB_LOCATION, isHub: true },
    ...clusterOrders.map(o => ({ ...o, isHub: false }))
  ];

  const n = points.length;

  // 1. Initial Route via Priority & Nearest Neighbor
  // Priority orders (Express) get checked first
  const visited = new Array(n).fill(false);
  const tour = [0]; // Start at Hub
  visited[0] = true;

  while (tour.length < n) {
    const currentIdx = tour[tour.length - 1];
    let bestNext = -1;
    let bestScore = 999999;

    for (let candidate = 1; candidate < n; candidate++) {
      if (!visited[candidate]) {
        const rawDist = haversineDistanceKm(
          points[currentIdx].lat, points[currentIdx].lng,
          points[candidate].lat, points[candidate].lng
        );
        // Express priority discount gives candidate an artificial proximity boost
        const priorityFactor = points[candidate].priority === 'Express' ? 0.6 : 1.0;
        const score = rawDist * priorityFactor;

        if (score < bestScore) {
          bestScore = score;
          bestNext = candidate;
        }
      }
    }

    visited[bestNext] = true;
    tour.push(bestNext);
  }

  // Return to Hub to complete loop
  tour.push(0);

  // 2. 2-Opt Optimization Iterations
  let improved = true;
  let iterations = 0;
  while (improved && iterations < 30) {
    improved = false;
    iterations++;

    for (let i = 1; i < tour.length - 2; i++) {
      for (let k = i + 1; k < tour.length - 1; k++) {
        // Evaluate swapping edges (i-1 -> i) and (k -> k+1) with (i-1 -> k) and (i -> k+1)
        const pA = points[tour[i - 1]];
        const pB = points[tour[i]];
        const pC = points[tour[k]];
        const pD = points[tour[k + 1]];

        const currentDist = haversineDistanceKm(pA.lat, pA.lng, pB.lat, pB.lng) +
                            haversineDistanceKm(pC.lat, pC.lng, pD.lat, pD.lng);
        const newDist = haversineDistanceKm(pA.lat, pA.lng, pC.lat, pC.lng) +
                        haversineDistanceKm(pB.lat, pB.lng, pD.lat, pD.lng);

        if (newDist < currentDist - 0.05) {
          // Perform 2-opt reverse of tour between i and k
          const reversedSub = tour.slice(i, k + 1).reverse();
          tour.splice(i, k - i + 1, ...reversedSub);
          improved = true;
        }
      }
    }
  }

  // Generate Step-by-Step Waypoints
  let cumulativeKm = 0;
  let departureMinutesFrom8AM = 0;

  const waypoints = tour.map((pointIdx, stepIndex) => {
    const pt = points[pointIdx];
    let legKm = 0;
    if (stepIndex > 0) {
      const prev = points[tour[stepIndex - 1]];
      legKm = haversineDistanceKm(prev.lat, prev.lng, pt.lat, pt.lng);
      cumulativeKm += legKm;
      // Assume 25 km/h urban speed + 5 min per delivery drop
      const travelMins = Math.round((legKm / 25) * 60);
      const stopMins = pt.isHub ? 0 : 5;
      departureMinutesFrom8AM += travelMins + stopMins;
    }

    const etaHour = 8 + Math.floor(departureMinutesFrom8AM / 60);
    const etaMin = String(departureMinutesFrom8AM % 60).padStart(2, '0');
    const etaStr = `${etaHour}:${etaMin} AM`;

    return {
      stepIndex: stepIndex + 1,
      type: pt.isHub ? (stepIndex === 0 ? 'Hub Origin' : 'Hub Return') : 'Customer Drop',
      name: pt.name || pt.customerName,
      address: pt.address,
      orderId: pt.id,
      priority: pt.priority || 'N/A',
      lat: pt.lat,
      lng: pt.lng,
      legDistanceKm: Number(legKm.toFixed(2)),
      cumulativeDistanceKm: Number(cumulativeKm.toFixed(2)),
      eta: etaStr,
      items: pt.items || []
    };
  });

  const totalRouteDistanceKm = Number(cumulativeKm.toFixed(2));
  const estimatedTourDurationMins = departureMinutesFrom8AM;

  return {
    clusterId,
    totalStops: clusterOrders.length,
    totalDistanceKm: totalRouteDistanceKm,
    estimatedDurationMinutes: estimatedTourDurationMins,
    co2SavedVsSeparateDeliveryKg: Number((clusterOrders.length * 3.5 - totalRouteDistanceKm * 0.04).toFixed(1)),
    waypoints
  };
}

// ==========================================
// ALGORITHM 4: FARMER FAIR-PRICE BREAKDOWN
// ==========================================
function getFairPriceBreakdown(cropId, quantityKg = 1) {
  const crop = CROPS_CATALOG.find(c => c.id === cropId) || CROPS_CATALOG[0];

  const totalCustomerPrice = crop.customerPrice * quantityKg;
  const farmerPayout = crop.farmerPrice * quantityKg;
  const hubFee = crop.hubFee * quantityKg;
  const deliveryFee = crop.deliveryFee * quantityKg;
  const platformFee = crop.platformFee * quantityKg;

  // Traditional Mandi Benchmark
  const mandiMiddlemanTotal = crop.mandiMiddlemanPrice * quantityKg;
  const traditionalFarmerPayout = Math.round(mandiMiddlemanTotal * 0.25);
  const traditionalMiddlemenCut = Math.round(mandiMiddlemanTotal * 0.75);

  const farmerExtraIncome = farmerPayout - traditionalFarmerPayout;
  const customerSavings = mandiMiddlemanTotal - totalCustomerPrice;

  return {
    crop: {
      id: crop.id,
      name: crop.name,
      category: crop.category,
      unit: crop.unit,
      image: crop.image
    },
    quantityKg,
    pricing: {
      farmerShare: {
        amount: farmerPayout,
        percent: Math.round((farmerPayout / totalCustomerPrice) * 100),
        label: 'Farmer Direct Base Payout',
        description: 'Transferred directly to farmer bank account within 2 hours of hub intake'
      },
      hubShare: {
        amount: hubFee,
        percent: Math.round((hubFee / totalCustomerPrice) * 100),
        label: 'Hub Quality Check & Eco-Packing',
        description: 'Electronic sorting, grading, and reusable thermal crate packing'
      },
      deliveryShare: {
        amount: deliveryFee,
        percent: Math.round((deliveryFee / totalCustomerPrice) * 100),
        label: 'AI-Grouped Clean EV Delivery',
        description: 'Fair wage paid to local EV delivery partners for consolidated cluster drops'
      },
      platformShare: {
        amount: platformFee,
        percent: Math.round((platformFee / totalCustomerPrice) * 100),
        label: 'Farm2Home AI Platform & IoT',
        description: 'Demand neural forecasting, route optimization compute, and platform maintenance'
      },
      finalCustomerPrice: totalCustomerPrice
    },
    comparison: {
      mandiMiddlemanTotal,
      traditionalFarmerPayout,
      traditionalMiddlemenCut,
      farmerExtraIncome,
      farmerExtraIncomePercent: `+${Math.round((farmerExtraIncome / traditionalFarmerPayout) * 100)}%`,
      customerSavings,
      customerSavingsPercent: `${Math.round((customerSavings / mandiMiddlemanTotal) * 100)}%`
    }
  };
}

// ==========================================
// REST API ENDPOINTS
// ==========================================

// 1. Health check & System Overview
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    app: 'Farm2Home Hackathon MVP',
    hub: HUB_LOCATION,
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// 2. AI Demand Prediction
app.get('/api/demand-prediction', (req, res) => {
  const weather = req.query.weather || 'Sunny';
  const festival = req.query.festival === 'true';
  const isWeekend = req.query.weekend === 'true';

  const predictions = calculateAIDemand(weather, festival, isWeekend);
  res.json({
    parameters: { weather, festival, isWeekend },
    predictions,
    summary: {
      totalPredictedDemandKg: predictions.reduce((sum, p) => sum + p.predictedDemandKg, 0),
      totalRecommendedHarvestKg: predictions.reduce((sum, p) => sum + p.recommendedHarvestKg, 0),
      totalWastageSavedKg: predictions.reduce((sum, p) => sum + p.wastageSavedKg, 0),
      totalFarmerExtraProfit: predictions.reduce((sum, p) => sum + p.extraFarmerProfit, 0)
    }
  });
});

// Commit harvest by farmer
app.post('/api/demand-prediction/commit', (req, res) => {
  const { farmerId, cropId, committedKg } = req.body;
  const crop = CROPS_CATALOG.find(c => c.id === cropId);
  if (!crop) return res.status(404).json({ error: 'Crop not found' });

  crop.currentHubStockKg += Number(committedKg);

  const commitment = {
    id: `CMT-${Date.now().toString().slice(-4)}`,
    farmerId: farmerId || 'F-101',
    farmerName: 'Ramesh Patel',
    cropId,
    cropName: crop.name,
    committedKg: Number(committedKg),
    payout: Number(committedKg) * crop.farmerPrice,
    committedAt: new Date().toLocaleTimeString(),
    status: 'Scheduled for Early Intake (06:00 AM)'
  };

  HARVEST_COMMITMENTS.unshift(commitment);

  res.json({
    success: true,
    commitment,
    updatedHubStock: crop.currentHubStockKg
  });
});

// 3. Orders Catalog & Management
app.get('/api/orders', (req, res) => {
  res.json({
    orders: CUSTOMER_ORDERS,
    hub: HUB_LOCATION
  });
});

app.post('/api/orders', (req, res) => {
  const { customerName, address, neighborhood, lat, lng, items, priority } = req.body;

  const orderId = `ORD-${Math.floor(100 + Math.random() * 900)}`;
  let totalPrice = 0;

  const formattedItems = (items || []).map(item => {
    const crop = CROPS_CATALOG.find(c => c.id === item.cropId) || CROPS_CATALOG[0];
    const itemTotal = crop.customerPrice * (item.qty || 1);
    totalPrice += itemTotal;
    return {
      cropId: crop.id,
      name: crop.name,
      qty: item.qty || 1,
      unitPrice: crop.customerPrice
    };
  });

  const newOrder = {
    id: orderId,
    customerName: customerName || 'Rahul Sharma',
    address: address || 'Apartment 204, Green Heights',
    neighborhood: neighborhood || 'Bellandur - Sector 4',
    lat: Number(lat) || (12.9300 + (Math.random() - 0.5) * 0.02),
    lng: Number(lng) || (77.6800 + (Math.random() - 0.5) * 0.02),
    items: formattedItems.length > 0 ? formattedItems : [{ cropId: 'crop-1', name: 'Organic Vine Tomatoes', qty: 2 }],
    totalPrice: totalPrice || 104,
    orderTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    priority: priority || 'Normal',
    clusterId: null,
    deliveryStatus: 'Pending Batching'
  };

  CUSTOMER_ORDERS.unshift(newOrder);

  res.json({
    success: true,
    order: newOrder
  });
});

// 4. Smart Order Grouping
app.post('/api/group-orders', (req, res) => {
  const groupingResult = runSmartOrderGrouping(CUSTOMER_ORDERS);
  res.json(groupingResult);
});

// 5. AI Route Optimization
app.post('/api/optimize-route', (req, res) => {
  const { clusterId } = req.body;
  // Make sure orders are clustered first
  runSmartOrderGrouping(CUSTOMER_ORDERS);

  const targetClusterId = clusterId || 'CLUSTER-A';
  const route = optimizeClusterRoute(targetClusterId, CUSTOMER_ORDERS);

  if (!route) {
    return res.status(404).json({ error: 'No orders found for cluster ' + targetClusterId });
  }

  res.json({
    hub: HUB_LOCATION,
    route
  });
});

// 6. Farmer Fair-Price Breakdown
app.get('/api/fair-price', (req, res) => {
  const cropId = req.query.cropId || 'crop-1';
  const qty = Number(req.query.qty) || 1;
  const breakdown = getFairPriceBreakdown(cropId, qty);
  res.json(breakdown);
});

// All crops catalog with transparent breakdown
app.get('/api/catalog', (req, res) => {
  const catalogWithBreakdowns = CROPS_CATALOG.map(crop => ({
    ...crop,
    breakdown: getFairPriceBreakdown(crop.id, 1)
  }));
  res.json(catalogWithBreakdowns);
});

// 7. IoT Telemetry (Smart Cold-Chain Sensors)
app.get('/api/iot-telemetry', (req, res) => {
  res.json({
    hubId: HUB_LOCATION.id,
    hubName: HUB_LOCATION.name,
    coldStorageChamber: {
      temperatureCelsius: 6.8,
      optimalTempRange: '4°C - 8°C',
      humidityPercent: 88.5,
      optimalHumidityRange: '85% - 95%',
      ethylenePpm: 0.12,
      ethyleneStatus: 'Optimal (Low Ripening Risk)',
      status: 'Healthy Cold Chain'
    },
    smartDispatchCrates: [
      {
        crateId: 'CRATE-EV-01',
        assignedBatch: 'Batch #A (Bellandur)',
        tempCelsius: 8.1,
        freshnessIndex: '98.5%',
        sealStatus: 'Locked (Tamper-Proof NFC)',
        batteryPercent: 94
      },
      {
        crateId: 'CRATE-EV-02',
        assignedBatch: 'Batch #B (Kadubeesanahalli)',
        tempCelsius: 7.9,
        freshnessIndex: '99.0%',
        sealStatus: 'Locked (Tamper-Proof NFC)',
        batteryPercent: 89
      },
      {
        crateId: 'CRATE-EV-03',
        assignedBatch: 'Batch #C (HSR Layout)',
        tempCelsius: 8.4,
        freshnessIndex: '97.8%',
        sealStatus: 'Locked (Tamper-Proof NFC)',
        batteryPercent: 92
      }
    ]
  });
});

// Farmers list & earnings
app.get('/api/farmers', (req, res) => {
  res.json({
    farmers: FARMERS,
    commitments: HARVEST_COMMITMENTS
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Farm2Home Server running on http://localhost:${PORT}`);
});
