require('dotenv').config();
const express = require('express');
const Anthropic = require('@anthropic-ai/sdk');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.get('/', (req, res) => {
  res.render('index');
});

app.post('/generate', async (req, res) => {
  try {
    const { occasion, recipientName, relationship, tone } = req.body;
    
    // Mystery tone options - randomly selected
    const mysteryTones = [
      'overly dramatic and theatrical',
      'completely deadpan and monotone', 
      'written like a nature documentary',
      'furiously passionate about everything',
      'written like a conspiracy theorist',
      'overly formal and Victorian',
      'written like a sports commentator',
      'melodramatically sad about everything',
      'written like a food critic',
      'bizarrely optimistic about doom',
      'written like a weather forecast',
      'overly clinical and scientific',
      'written like a movie trailer narrator',
      'suspiciously cheerful',
      'written like breaking news',
      'philosophically deep about mundane things',
      'written like a pirate',
      'passive-aggressively sweet',
      'written like a meditation guru',
      'comically confused about basic concepts'
    ];
    
    // Determine if this should include a random tangent (20% chance)
    const includeTangent = Math.random() < 0.2;
    let randomFact = '';
    
    // Generate random fact from Claude if needed
    if (includeTangent) {
      try {
        const factMessage = await anthropic.messages.create({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 100,
          messages: [{
            role: 'user',
            content: `Generate a single fascinating, unexpected, or quirky fact about anything - science, nature, history, space, animals, food, technology, etc. Make it interesting and surprising. Format it as a casual statement starting with "Did you know" or "Fun fact" or "Here's something wild" followed by the fact, then end with "Anyway," or "Speaking of which," or "But I digress," - keep it conversational and brief (1-2 sentences max).`
          }]
        });
        randomFact = factMessage.content[0].text.trim();
      } catch (factError) {
        console.log('Failed to generate random fact, continuing without it');
        // If fact generation fails, continue without the tangent
      }
    }
    
    // Handle mystery tone
    let actualTone = tone;
    if (tone === 'mystery') {
      actualTone = mysteryTones[Math.floor(Math.random() * mysteryTones.length)];
    }
    
    // Construct prompt for Claude
    let prompt = `Generate a greeting card message for a ${occasion} card. The recipient is ${recipientName} and they are my ${relationship}. 

Make the message ${actualTone} and include some gentle self-deprecating humor about how I'm using AI to write this because I'm too unoriginal to come up with something myself. Keep it warm and genuine underneath the humor.

${randomFact ? `Start with this random fact and then transition smoothly to the greeting: "${randomFact}"` : ''}

The message should be 2-3 sentences long and feel personal despite being AI-generated. Make fun of me (the sender) for being uncreative, not the recipient.`;

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 250,
      messages: [{
        role: 'user',
        content: prompt
      }]
    });

    const generatedMessage = message.content[0].text;
    
    res.json({ 
      success: true, 
      message: generatedMessage,
      disclaimer: randomFact ? "✨ Generated with AI assistance (with bonus random knowledge!)" : "✨ Generated with AI assistance",
      mysteryTone: tone === 'mystery' ? actualTone : null,
      hadRandomFact: !!randomFact
    });
    
  } catch (error) {
    console.error('Error generating message:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to generate message. Please try again.' 
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});