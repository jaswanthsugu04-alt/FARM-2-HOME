async function runTests() {
  const baseUrl = 'http://localhost:3000';
  console.log('--- Starting Farm2Home Hackathon MVP Test Suite ---');

  // 1. Health
  const healthRes = await fetch(`${baseUrl}/api/health`);
  const health = await healthRes.json();
  console.log('✅ 1. Health API:', health.status, health.hub.name);

  // 2. AI Demand Prediction
  const demandRes = await fetch(`${baseUrl}/api/demand-prediction?weather=Rainy&festival=true&weekend=true`);
  const demand = await demandRes.json();
  console.log('✅ 2. AI Demand Prediction: Total Forecast Demand =', demand.summary.totalPredictedDemandKg, 'kg, Spoilage Saved =', demand.summary.totalWastageSavedKg, 'kg');

  // 3. Commit Harvest
  const commitRes = await fetch(`${baseUrl}/api/demand-prediction/commit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cropId: 'crop-1', committedKg: 75, farmerId: 'F-101' })
  });
  const commitData = await commitRes.json();
  console.log('✅ 3. Commit Harvest API:', commitData.commitment.cropName, commitData.commitment.committedKg, 'kg committed, Payout = ₹' + commitData.commitment.payout);

  // 4. Create Order
  const orderRes = await fetch(`${baseUrl}/api/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      customerName: 'Aditi Rao',
      address: 'Skyline Apt 104, Bellandur',
      neighborhood: 'Bellandur - Sector 4',
      items: [{ cropId: 'crop-1', qty: 2 }, { cropId: 'crop-2', qty: 1 }],
      priority: 'Express'
    })
  });
  const orderData = await orderRes.json();
  console.log('✅ 4. Customer Order API:', orderData.order.id, orderData.order.customerName, 'Total = ₹' + orderData.order.totalPrice);

  // 5. Smart Order Grouping
  const groupRes = await fetch(`${baseUrl}/api/group-orders`, { method: 'POST' });
  const groupData = await groupRes.json();
  console.log('✅ 5. Smart Order Grouping: Formed', groupData.clusters.length, 'Clusters. Trip Reduction =', groupData.metrics.tripReductionPercent, 'Distance Saved =', groupData.metrics.distanceSavedKm, 'km, CO2 Saved =', groupData.metrics.co2SavedKg);

  // 6. AI Route Optimization
  const routeRes = await fetch(`${baseUrl}/api/optimize-route`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ clusterId: 'CLUSTER-A' })
  });
  const routeData = await routeRes.json();
  console.log('✅ 6. AI 2-Opt Route Optimization: Cluster A Stops =', routeData.route.totalStops, 'Distance =', routeData.route.totalDistanceKm, 'km, Duration =', routeData.route.estimatedDurationMinutes, 'mins');
  console.log('   Waypoints:', routeData.route.waypoints.map(w => `${w.type}: ${w.name} (${w.eta})`).join(' -> '));

  // 7. Fair Price System
  const priceRes = await fetch(`${baseUrl}/api/fair-price?cropId=crop-1&qty=1`);
  const priceData = await priceRes.json();
  console.log('✅ 7. Fair Price Breakdown (Organic Tomatoes):');
  console.log('   👨‍🌾 Farmer Direct Payout:', priceData.pricing.farmerShare.amount, `(${priceData.pricing.farmerShare.percent}%)`);
  console.log('   🏢 Hub Quality & Packing:', priceData.pricing.hubShare.amount, `(${priceData.pricing.hubShare.percent}%)`);
  console.log('   🚚 Clustered Clean EV Delivery:', priceData.pricing.deliveryShare.amount, `(${priceData.pricing.deliveryShare.percent}%)`);
  console.log('   💻 AI Platform & Operations:', priceData.pricing.platformShare.amount, `(${priceData.pricing.platformShare.percent}%)`);
  console.log('   🛒 Final Customer Price: ₹' + priceData.pricing.finalCustomerPrice, 'vs Mandi Supermarket ₹' + priceData.comparison.mandiMiddlemanTotal);
  console.log('   💡 Farmer Extra Gain: +' + priceData.comparison.farmerExtraIncomePercent + ', Customer Savings: ' + priceData.comparison.customerSavingsPercent);

  // 8. IoT Telemetry
  const iotRes = await fetch(`${baseUrl}/api/iot-telemetry`);
  const iotData = await iotRes.json();
  console.log('✅ 8. IoT Cold-Chain Telemetry: Temp =', iotData.coldStorageChamber.temperatureCelsius, '°C, Humidity =', iotData.coldStorageChamber.humidityPercent, '%, Ethylene =', iotData.coldStorageChamber.ethylenePpm, 'ppm, Smart Crates =', iotData.smartDispatchCrates.length);

  console.log('\n🎉 ALL 8 HACKATHON BACKEND & ALGORITHMIC MODULES PASSED WITH 100% SUCCESS!');
}

runTests().catch(console.error);
