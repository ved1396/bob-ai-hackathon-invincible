// GRIDGUARD AI - AI Operational Assistant Service (Bob Assistant)
class AIService {
  async generateBobResponse(userPrompt, currentContext = 'Overview') {
    const prompt = userPrompt.toLowerCase();
    
    let text = "";
    let structuredResponse = undefined;

    if (prompt.includes('inspect') || prompt.includes('which asset') || prompt.includes('prioritize') || prompt.includes('highest risk')) {
      text = "Based on real-time failure probability models and multi-sensor telemetry, here is today's ranked inspection priority order:";
      structuredResponse = {
        recommendation: "Immediate field dispatch is required for Substation S-21 (T-104).",
        metrics: [
          { label: "1. T-104 (Substation S-21)", value: "87% CRITICAL — Temp 104°C, Vib 7.8mm/s", isAlert: true },
          { label: "2. T-208 (Substation S-08)", value: "79% CRITICAL — DGA Gas Warning, Temp 98°C", isAlert: true },
          { label: "3. S-21 (Switching Substation)", value: "74% HIGH — Storm & Lightning Risk", isAlert: true },
          { label: "4. T-311 (Substation S-14)", value: "68% HIGH — Wind Stress, Vib 5.9mm/s" },
          { label: "5. F-12 (Industrial Feeder)", value: "65% HIGH — Tree Contact Hazard" }
        ],
        actionButtons: [
          { label: "Analyze T-104 Deep-Dive", query: "Why is T-104 critical?" },
          { label: "Assign Crew C-07 to T-104", query: "Where should crews be positioned?" }
        ]
      };
    } else if (prompt.includes('t-104') || prompt.includes('why is t-104') || prompt.includes('critical')) {
      text = "Transformer T-104 (Substation S-21, 345kV Bulk) is elevated to 87% CRITICAL due to internal thermal-vibration degradation combined with severe weather loading:";
      structuredResponse = {
        recommendation: "Prescribed Action: Dispatch Crew C-07 for emergency cooling inspection & coil testing within 24 hours.",
        metrics: [
          { label: "Top-Oil Temperature", value: "104°C (Limit: 90°C)", isAlert: true },
          { label: "Vibration Harmonics", value: "7.8 mm/s (Limit: 4.5 mm/s)", isAlert: true },
          { label: "Dielectric Oil Breakdown", value: "62% (Degraded, Limit: >80%)", isAlert: true },
          { label: "Storm Front Loading", value: "+18% Risk Multiplier (55 km/h Gusts)" }
        ],
        actionButtons: [
          { label: "Create Maintenance Task for T-104", query: "What should we maintain today?" },
          { label: "Check Crew Readiness", query: "Where should crews be positioned?" }
        ]
      };
    } else if (prompt.includes('maintain') || prompt.includes('plan') || prompt.includes('today')) {
      text = "Here is the recommended maintenance dispatch queue for today's high-risk assets:";
      structuredResponse = {
        recommendation: "Crew C-07 is pre-positioned at Substation S-21. Crew C-02 & C-03 are scheduled for secondary inspection shifts.",
        metrics: [
          { label: "WO-8901 (P1 Critical)", value: "Crew C-07 → T-104 Emergency Cooling Check", isAlert: true },
          { label: "WO-8902 (P1 Critical)", value: "Crew C-02 → T-208 Oil DGA Sampling", isAlert: true },
          { label: "WO-8903 (P2 High)", value: "Crew C-03 → S-21 Busbar Dampening" }
        ],
        actionButtons: [
          { label: "Show Unresolved Incidents", query: "Show unresolved incidents." }
        ]
      };
    } else if (prompt.includes('crew') || prompt.includes('position') || prompt.includes('dispatch')) {
      text = "Crew Pre-Positioning Recommendations based on nearest risk zones and arrival ETA:";
      structuredResponse = {
        recommendation: "Pre-position Crew C-07 near Substation S-21 (Zone 4) prior to expected peak outage window.",
        metrics: [
          { label: "Crew C-07 (Transformer Specs)", value: "ETA 14m to Substation S-21 (T-104)", isAlert: true },
          { label: "Crew C-02 (Oil Diagnostics)", value: "ETA 18m to Substation S-08 (T-208)" },
          { label: "Crew C-03 (Substation Response)", value: "Positioned at Substation S-21 (On Site)" }
        ],
        actionButtons: [
          { label: "Dispatch Crew C-07 to T-104", query: "What should we maintain today?" }
        ]
      };
    } else if (prompt.includes('weather') || prompt.includes('storm') || prompt.includes('rain')) {
      text = "Current atmospheric analysis shows a severe convective storm front moving through Zone 4 (Substation S-21 corridor):";
      structuredResponse = {
        recommendation: "Zone 4 assets (T-104, S-21, F-12) carry a +18% failure risk surcharge due to 55 km/h wind gusts and lightning risk.",
        metrics: [
          { label: "Zone 4 (Substation S-21)", value: "Heavy Thunderstorm • 55 km/h Wind • +18% Risk", isAlert: true },
          { label: "Zone 2 (Substation S-08)", value: "High Wind & Heat • 42 km/h Wind • +12% Risk" },
          { label: "Zone 1 (Substation S-14)", value: "Moderate Rain • 30 km/h Wind • +8% Risk" }
        ]
      };
    } else if (prompt.includes('sensor') || prompt.includes('health') || prompt.includes('reading')) {
      text = "Telemetry sensor health evaluation across high-risk equipment:";
      structuredResponse = {
        recommendation: "Sensors SEN-104-TEMP (Temperature) and SEN-104-VIB (Vibration) report critical safety limit breaches.",
        metrics: [
          { label: "SEN-104-TEMP (T-104)", value: "104°C (Critical breach)", isAlert: true },
          { label: "SEN-104-VIB (T-104)", value: "7.8 mm/s (Critical breach)", isAlert: true },
          { label: "SEN-208-TEMP (T-208)", value: "98°C (Critical breach)", isAlert: true },
          { label: "SEN-CB402-PRESS (CB-402)", value: "5.8 Bar (Warning low)" }
        ]
      };
    } else if (prompt.includes('incident') || prompt.includes('outage') || prompt.includes('unresolved')) {
      text = "Active unresolved incidents logged in the grid operations center:";
      structuredResponse = {
        recommendation: "INC-2041 is classified as Priority 1 Critical and requires immediate field containment.",
        metrics: [
          { label: "INC-2041 (T-104)", value: "Risk Spike 87% (Crew Dispatched)", isAlert: true },
          { label: "INC-2039 (Substation S-21)", value: "Severe Storm Front 55km/h (Investigating)", isAlert: true },
          { label: "INC-2035 (T-208)", value: "Oil DGA Anomaly 98°C (Open)" }
        ]
      };
    } else {
      text = `Bob Assistant synthesis for prompt "${userPrompt}" under context [${currentContext}]: Overall grid health is 92.4% OPERATIONAL. Transformer T-104 remains the single highest priority asset requiring maintenance attention (87% Risk).`;
      structuredResponse = {
        recommendation: "Select an inquiry below or inspect individual asset telemetries.",
        actionButtons: [
          { label: "Which assets are at highest risk?", query: "Which assets are at highest risk?" },
          { label: "What should we maintain today?", query: "What should we maintain today?" },
          { label: "Where should crews be positioned?", query: "Where should crews be positioned?" }
        ]
      };
    }

    return {
      id: `msg-${Date.now()}`,
      sender: 'bob',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      contextTag: currentContext,
      structuredResponse
    };
  }
}

export const aiService = new AIService();
