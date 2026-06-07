const promptInput = document.getElementById("promptInput");
const predictButton = document.getElementById("predictButton");
const continueButton = document.getElementById("continueButton");
const autoButton = document.getElementById("autoButton");
const stopButton = document.getElementById("stopButton");
const resetButton = document.getElementById("resetButton");
const predictionContainer = document.getElementById("predictionContainer");
const evaluationList = document.getElementById("evaluationList");
const evaluationChartCanvas = document.getElementById("evaluationChart");

let autoModeActive = false;
let model = null;
let modelReady = false;
let lastPredictions = [];
let evaluationChartInstance = null;

// -----------------------------
// Eigener neutraler deutscher Trainingsdatensatz
// bewusst mit wiederkehrenden Mustern
// -----------------------------
const trainingText = `
ein modell lernt aus daten
ein modell erkennt muster
ein modell trifft vorhersagen
ein modell verarbeitet informationen
ein modell verbessert seine ergebnisse
ein modell braucht gute daten
ein modell nutzt den kontext
ein modell berechnet wahrscheinlichkeiten
ein modell sagt das nächste wort voraus
ein modell kann texte erzeugen

das modell lernt aus daten
das modell erkennt muster
das modell trifft vorhersagen
das modell verarbeitet informationen
das modell verbessert seine ergebnisse
das modell braucht gute daten
das modell nutzt den kontext
das modell berechnet wahrscheinlichkeiten
das modell sagt das nächste wort voraus
das modell kann texte erzeugen

ein system lernt aus daten
ein system erkennt muster
ein system verarbeitet eingaben
ein system liefert ergebnisse
ein system reagiert auf neue eingaben
ein system nutzt gespeicherte informationen
ein system kann automatisch arbeiten
ein system verbessert die analyse
ein system unterstützt menschen
ein system trifft einfache entscheidungen

die universität vermittelt wissen
die universität bietet kurse an
die universität unterstützt studenten
die universität fördert das lernen
die universität stellt aufgaben
die universität bewertet ergebnisse
die universität nutzt digitale systeme
die universität arbeitet mit daten
die universität vermittelt methoden
die universität hilft beim verstehen

lernen braucht zeit
lernen braucht übung
lernen braucht geduld
lernen verbessert das verständnis
lernen funktioniert durch wiederholung
lernen hilft bei schwierigen aufgaben
lernen ist ein wichtiger prozess
lernen kann herausfordernd sein
lernen wird durch beispiele unterstützt
lernen führt zu besseren ergebnissen

menschen lernen jeden tag
menschen nutzen technik
menschen arbeiten im team
menschen treffen entscheidungen
menschen sammeln erfahrungen
menschen sprechen verschiedene sprachen
menschen verarbeiten informationen
menschen nutzen das internet
menschen entwickeln neue ideen
menschen brauchen verständliche systeme

daten bilden die grundlage
daten werden analysiert
daten werden verarbeitet
daten verbessern modelle
daten beeinflussen die ergebnisse
daten enthalten wichtige informationen
daten helfen beim lernen
daten können gespeichert werden
daten machen muster sichtbar
daten sind für modelle wichtig

sprache besteht aus wörtern
sprache braucht kontext
sprache enthält informationen
sprache wird durch muster geprägt
sprache kann analysiert werden
sprache wird von menschen genutzt
sprache ist für kommunikation wichtig
sprache hilft beim verstehen
sprache kann von modellen verarbeitet werden
sprache verändert sich durch den kontext

ein sprachmodell berechnet wahrscheinlichkeiten
ein sprachmodell verarbeitet wörter
ein sprachmodell nutzt kontext
ein sprachmodell sagt das nächste wort voraus
ein sprachmodell erzeugt neue texte
ein sprachmodell lernt aus trainingsdaten
ein sprachmodell erkennt sprachliche muster
ein sprachmodell nutzt ein wörterbuch
ein sprachmodell gibt eine softmax verteilung aus
ein sprachmodell unterstützt die wortvorhersage

die vorhersage hängt vom kontext ab
die vorhersage nutzt bekannte wörter
die vorhersage zeigt wahrscheinliche wörter
die vorhersage ist nicht immer perfekt
die vorhersage verbessert sich durch training
die vorhersage basiert auf daten
die vorhersage wird als liste angezeigt
die vorhersage kann ausgewählt werden
die vorhersage ergänzt den text
die vorhersage zeigt modellverhalten

training verbessert ein modell
training braucht daten
training braucht wiederholung
training erzeugt bessere ergebnisse
training kann lange dauern
training nutzt beispiele
training optimiert die gewichte
training verringert den fehler
training hilft bei der wortvorhersage
training zeigt den lernprozess

ein neuronales netz lernt aus daten
ein neuronales netz erkennt muster
ein neuronales netz verarbeitet eingaben
ein neuronales netz nutzt gewichte
ein neuronales netz kann sprache verarbeiten
ein neuronales netz wird trainiert
ein neuronales netz verbessert vorhersagen
ein neuronales netz ist ein modell
ein neuronales netz nutzt aktivierungen
ein neuronales netz liefert ergebnisse

ein lstm modell verarbeitet sequenzen
ein lstm modell merkt sich kontext
ein lstm modell nutzt vorherige wörter
ein lstm modell eignet sich für sprache
ein lstm modell lernt wortfolgen
ein lstm modell trifft vorhersagen
ein lstm modell nutzt rekurrente struktur
ein lstm modell kann text erzeugen
ein lstm modell arbeitet mit sequenzen
ein lstm modell wird mit daten trainiert

der nutzer gibt text ein
der nutzer klickt auf vorhersage
der nutzer wählt ein wort aus
der nutzer ergänzt den text
der nutzer kann weiter klicken
der nutzer kann automatisch generieren
der nutzer kann die ausgabe stoppen
der nutzer kann die eingabe zurücksetzen
der nutzer sieht wahrscheinlichkeiten
der nutzer erkennt das modellverhalten

gute daten verbessern die vorhersage
gute daten helfen dem modell
gute daten machen muster sichtbar
gute daten erhöhen die qualität
gute daten unterstützen das training
gute daten führen zu besseren ergebnissen
gute daten sind wichtig für modelle
gute daten reduzieren fehler
gute daten verbessern die analyse
gute daten erklären zusammenhänge

ein guter text ist verständlich
ein guter text enthält informationen
ein guter text hat struktur
ein guter text nutzt klare wörter
ein guter text hilft beim lernen
ein guter text unterstützt das verständnis
ein guter text kann analysiert werden
ein guter text besteht aus sätzen
ein guter text enthält wiederholungen
ein guter text verbessert das training

technologie hilft menschen
technologie verändert den alltag
technologie verarbeitet daten
technologie unterstützt das lernen
technologie ermöglicht neue lösungen
technologie nutzt digitale systeme
technologie entwickelt sich schnell
technologie verbessert arbeitsprozesse
technologie verbindet menschen
technologie braucht verständliche bedienung

software besteht aus code
software verarbeitet daten
software löst aufgaben
software wird verbessert
software unterstützt menschen
software nutzt algorithmen
software kann automatisch arbeiten
software erzeugt ausgaben
software braucht klare struktur
software hilft im alltag
`;

// -----------------------------
// Einstellungen
// -----------------------------
const sequenceLength = 4;
const epochs = 120;
const lstmUnits = 64;
const learningRate = 0.005;

// -----------------------------
// Text bereinigen
// -----------------------------
function normalizeText(text) {
  return text
    .toLowerCase()
    .replace(/[.,!?;:()"]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// -----------------------------
// Tokenisierung
// -----------------------------
function tokenize(text) {
  const normalized = normalizeText(text);

  if (normalized.length === 0) {
    return [];
  }

  return normalized.split(" ");
}

// -----------------------------
// Wörterbuch erstellen
// -----------------------------
function buildVocabulary(tokens) {
  const uniqueWords = [...new Set(tokens)].sort();

  const wordToIndex = {};
  const indexToWord = {};

  uniqueWords.forEach((word, index) => {
    wordToIndex[word] = index;
    indexToWord[index] = word;
  });

  return {
    vocabulary: uniqueWords,
    wordToIndex,
    indexToWord
  };
}

// -----------------------------
// Trainingssequenzen erstellen
// -----------------------------
function createTrainingSequences(tokens, wordToIndex, sequenceLength) {
  const sequences = [];

  for (let i = 0; i < tokens.length - sequenceLength; i++) {
    const inputWords = tokens.slice(i, i + sequenceLength);
    const targetWord = tokens[i + sequenceLength];

    const inputIndices = inputWords.map((word) => wordToIndex[word]);
    const targetIndex = wordToIndex[targetWord];

    sequences.push({
      inputWords,
      targetWord,
      inputIndices,
      targetIndex
    });
  }

  return sequences;
}

// -----------------------------
// Trainingsdaten vorbereiten
// -----------------------------
const tokens = tokenize(trainingText);
const vocabularyData = buildVocabulary(tokens);
const vocabularySize = vocabularyData.vocabulary.length;

const trainingSequences = createTrainingSequences(
  tokens,
  vocabularyData.wordToIndex,
  sequenceLength
);

console.log("Tokens:", tokens);
console.log("Anzahl Tokens:", tokens.length);
console.log("Vocabulary Größe:", vocabularySize);
console.log("Anzahl Trainingssequenzen:", trainingSequences.length);

// -----------------------------
// One-Hot-Vektor erzeugen
// -----------------------------
function oneHot(index, size) {
  const vector = new Array(size).fill(0);
  vector[index] = 1;
  return vector;
}

// -----------------------------
// Trainingsdaten -> Tensoren
// -----------------------------
function prepareTrainingTensors() {
  const xs = [];
  const ys = [];

  trainingSequences.forEach((sequence) => {
    const encodedInput = sequence.inputIndices.map((index) =>
      oneHot(index, vocabularySize)
    );

    xs.push(encodedInput);
    ys.push(oneHot(sequence.targetIndex, vocabularySize));
  });

  const xsTensor = tf.tensor3d(xs, [
    xs.length,
    sequenceLength,
    vocabularySize
  ]);

  const ysTensor = tf.tensor2d(ys, [
    ys.length,
    vocabularySize
  ]);

  return {
    xsTensor,
    ysTensor
  };
}

// -----------------------------
// LSTM-Modell erstellen
// -----------------------------
function createLSTMModel() {
  const newModel = tf.sequential();

  newModel.add(
    tf.layers.lstm({
      units: lstmUnits,
      returnSequences: true,
      inputShape: [sequenceLength, vocabularySize]
    })
  );

  newModel.add(
    tf.layers.lstm({
      units: lstmUnits
    })
  );

  newModel.add(
    tf.layers.dense({
      units: vocabularySize,
      activation: "softmax"
    })
  );

  newModel.compile({
    optimizer: tf.train.adam(learningRate),
    loss: "categoricalCrossentropy",
    metrics: ["accuracy"]
  });

  return newModel;
}

// -----------------------------
// Nachrichten anzeigen
// -----------------------------
function setPredictionMessage(message) {
  predictionContainer.innerHTML = `<p>${message}</p>`;
}

// -----------------------------
// Modell trainieren
// -----------------------------
async function trainModel() {
  setPredictionMessage("Das LSTM-Modell wird trainiert...");

  model = createLSTMModel();

  const { xsTensor, ysTensor } = prepareTrainingTensors();

  await model.fit(xsTensor, ysTensor, {
    epochs: epochs,
    batchSize: 32,
    shuffle: true,
    verbose: 0,
    callbacks: {
      onEpochEnd: async (epoch, logs) => {
        if ((epoch + 1) % 20 === 0 || epoch === 0) {
          console.log(
            `Epoch ${epoch + 1}/${epochs} - Loss: ${logs.loss.toFixed(4)}`
          );
        }

        await tf.nextFrame();
      }
    }
  });

  xsTensor.dispose();
  ysTensor.dispose();

  modelReady = true;

  setPredictionMessage(
    "Das Modell wurde trainiert. Geben Sie einen Text ein und klicken Sie auf „Vorhersage“."
  );

  console.log("LSTM-Modell ist bereit.");

  await evaluateModel();
}

// -----------------------------
// Prompt bereinigen
// -----------------------------
function cleanPromptText(text) {
  return text.trim().replace(/\s+/g, " ");
}

// -----------------------------
// Wort anhängen
// -----------------------------
function appendWord(word) {
  const currentText = cleanPromptText(promptInput.value);

  if (currentText.length === 0) {
    promptInput.value = word;
  } else {
    promptInput.value = `${currentText} ${word}`;
  }
}

// -----------------------------
// Prompt für LSTM vorbereiten
// -----------------------------
function preparePromptSequence(promptText) {
  const promptTokens = tokenize(promptText).filter((word) =>
    Object.prototype.hasOwnProperty.call(vocabularyData.wordToIndex, word)
  );

  let contextTokens = promptTokens.slice(-sequenceLength);

  while (contextTokens.length < sequenceLength) {
    contextTokens.unshift("ein");
  }

  const input = contextTokens.map((word) => {
    const index = vocabularyData.wordToIndex[word];
    return oneHot(index, vocabularySize);
  });

  return tf.tensor3d([input], [1, sequenceLength, vocabularySize]);
}

// -----------------------------
// LSTM-Vorhersage
// -----------------------------
async function getLSTMNextWordPredictions(promptText, topK = 5) {
  if (!modelReady || !model) {
    return [];
  }

  const inputTensor = preparePromptSequence(promptText);
  const outputTensor = model.predict(inputTensor);
  const probabilities = await outputTensor.data();

  inputTensor.dispose();
  outputTensor.dispose();

  const predictions = Array.from(probabilities).map((probability, index) => ({
    word: vocabularyData.indexToWord[index],
    probability
  }));

  predictions.sort((a, b) => b.probability - a.probability);

  return predictions.slice(0, topK);
}

// -----------------------------
// Vorhersagen anzeigen
// -----------------------------
function renderPredictions(predictions) {
  predictionContainer.innerHTML = "";

  if (predictions.length === 0) {
    predictionContainer.innerHTML =
      "<p>Keine Vorhersage möglich. Bitte prüfen Sie die Eingabe.</p>";
    return;
  }

  predictions.forEach((prediction) => {
    const button = document.createElement("button");
    button.className = "prediction-button";

    const percent = (prediction.probability * 100).toFixed(2);
    button.textContent = `${prediction.word} – ${percent} %`;

    button.addEventListener("click", async () => {
      appendWord(prediction.word);
      lastPredictions = await getLSTMNextWordPredictions(promptInput.value);
      renderPredictions(lastPredictions);
    });

    predictionContainer.appendChild(button);
  });
}

// -----------------------------
// Vorhersage auslösen
// -----------------------------
async function predictNextWords() {
  const text = cleanPromptText(promptInput.value);

  if (!modelReady) {
    predictionContainer.innerHTML =
      "<p>Das Modell wird noch trainiert. Bitte kurz warten.</p>";
    return;
  }

  if (text.length === 0) {
    predictionContainer.innerHTML =
      "<p>Bitte geben Sie zuerst einen Text ein.</p>";
    return;
  }

  lastPredictions = await getLSTMNextWordPredictions(text);
  renderPredictions(lastPredictions);
}

// -----------------------------
// Top-1 übernehmen
// -----------------------------
async function acceptTopPrediction() {
  const text = cleanPromptText(promptInput.value);

  if (!modelReady) {
    predictionContainer.innerHTML =
      "<p>Das Modell wird noch trainiert. Bitte kurz warten.</p>";
    return;
  }

  if (text.length === 0) {
    predictionContainer.innerHTML =
      "<p>Bitte geben Sie zuerst einen Text ein.</p>";
    return;
  }

  if (lastPredictions.length === 0) {
    lastPredictions = await getLSTMNextWordPredictions(text);
  }

  if (lastPredictions.length === 0) {
    predictionContainer.innerHTML =
      "<p>Es konnte kein nächstes Wort vorhergesagt werden.</p>";
    return;
  }

  appendWord(lastPredictions[0].word);

  lastPredictions = await getLSTMNextWordPredictions(promptInput.value);
  renderPredictions(lastPredictions);
}

// -----------------------------
// Auto-Generierung
// -----------------------------
async function autoGenerateWords() {
  const text = cleanPromptText(promptInput.value);

  if (!modelReady) {
    predictionContainer.innerHTML =
      "<p>Das Modell wird noch trainiert. Bitte kurz warten.</p>";
    return;
  }

  if (text.length === 0) {
    predictionContainer.innerHTML =
      "<p>Bitte geben Sie zuerst einen Text ein.</p>";
    return;
  }

  autoModeActive = true;

  for (let i = 0; i < 10; i++) {
    if (!autoModeActive) {
      break;
    }

    await acceptTopPrediction();
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  autoModeActive = false;
}

// -----------------------------
// Auto stoppen
// -----------------------------
function stopAutoGeneration() {
  autoModeActive = false;
}

// -----------------------------
// Reset
// -----------------------------
function resetApplication() {
  promptInput.value = "";
  predictionContainer.innerHTML = "<p>Noch keine Vorhersage vorhanden.</p>";
  lastPredictions = [];
  autoModeActive = false;
}

// -----------------------------
// Evaluation berechnen
// -----------------------------
async function evaluateModel() {
  if (!modelReady || !model) {
    return;
  }

  evaluationList.innerHTML = "<li>Evaluation wird berechnet...</li>";

  const { xsTensor, ysTensor } = prepareTrainingTensors();
  const predictionTensor = model.predict(xsTensor);
  const predictionArray = await predictionTensor.array();

  const kValues = [1, 5, 10, 20, 100];
  const results = {};

  kValues.forEach((k) => {
    results[k] = 0;
  });

  trainingSequences.forEach((sequence, sequenceIndex) => {
    const probabilities = predictionArray[sequenceIndex];

    const sortedIndices = probabilities
      .map((probability, index) => ({ probability, index }))
      .sort((a, b) => b.probability - a.probability)
      .map((entry) => entry.index);

    kValues.forEach((k) => {
      const effectiveK = Math.min(k, vocabularySize);
      const topKIndices = sortedIndices.slice(0, effectiveK);

      if (topKIndices.includes(sequence.targetIndex)) {
        results[k] += 1;
      }
    });
  });

  const accuracyResults = kValues.map((k) => ({
    k,
    accuracy: results[k] / trainingSequences.length
  }));

  renderEvaluationList(accuracyResults);
  renderEvaluationChart(accuracyResults);

  xsTensor.dispose();
  ysTensor.dispose();
  predictionTensor.dispose();
}

// -----------------------------
// Evaluation als Liste anzeigen
// -----------------------------
function renderEvaluationList(accuracyResults) {
  evaluationList.innerHTML = "";

  accuracyResults.forEach((result) => {
    const li = document.createElement("li");
    const percent = (result.accuracy * 100).toFixed(2);
    const effectiveK = Math.min(result.k, vocabularySize);

    if (result.k > vocabularySize) {
      li.textContent = `Top-${result.k} Accuracy: ${percent} % (effektiv Top-${effectiveK}, da das Wörterbuch kleiner ist)`;
    } else {
      li.textContent = `Top-${result.k} Accuracy: ${percent} %`;
    }

    evaluationList.appendChild(li);
  });
}

// -----------------------------
// Evaluation als Diagramm anzeigen
// -----------------------------
function renderEvaluationChart(accuracyResults) {
  const labels = accuracyResults.map((result) => `Top-${result.k}`);
  const values = accuracyResults.map((result) =>
    Number((result.accuracy * 100).toFixed(2))
  );

  if (evaluationChartInstance) {
    evaluationChartInstance.destroy();
  }

  evaluationChartInstance = new Chart(evaluationChartCanvas, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Accuracy in %",
          data: values,
          borderWidth: 1
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          title: {
            display: true,
            text: "Accuracy in %"
          }
        }
      }
    }
  });
}

// -----------------------------
// Events
// -----------------------------
predictButton.addEventListener("click", predictNextWords);
continueButton.addEventListener("click", acceptTopPrediction);
autoButton.addEventListener("click", autoGenerateWords);
stopButton.addEventListener("click", stopAutoGeneration);
resetButton.addEventListener("click", resetApplication);

// -----------------------------
// Start
// -----------------------------
trainModel();