const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 8090;
const BUILD_DIR = path.join(__dirname, 'build/generated/android'); // Module Federation files directory

// MIME types para diferentes tipos de arquivo
const MIME_TYPES = {
  '.js': 'application/javascript',
  '.bundle': 'application/javascript',
  '.json': 'application/json',
  '.map': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.css': 'text/css',
  '.html': 'text/html',
  '.txt': 'text/plain'
};

function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return MIME_TYPES[ext] || 'application/octet-stream';
}

function serveFile(res, filePath) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      console.error(`❌ Error reading file ${filePath}:`, err.message);
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('File not found');
      return;
    }

    const mimeType = getMimeType(filePath);
    res.writeHead(200, {
      'Content-Type': mimeType,
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Range',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    });
    res.end(data);
    
    console.log(`✅ Serving: ${path.basename(filePath)} (${mimeType})`);
  });
}

function findFile(filename) {
  // Search for Module Federation files in the android directory
  const androidPath = path.join(BUILD_DIR, filename);
  if (fs.existsSync(androidPath)) {
    return androidPath;
  }
  
  return null;
}

function listFiles(res) {
  // List Module Federation files from the android directory
  const androidFiles = fs.existsSync(BUILD_DIR) ? fs.readdirSync(BUILD_DIR) : [];
  
  const allFiles = androidFiles.map(f => ({ 
    name: f, 
    path: path.join(BUILD_DIR, f) 
  }));

  const fileList = allFiles.map(file => {
    const stats = fs.statSync(file.path);
    const isDir = stats.isDirectory();
    const size = isDir ? '-' : `${(stats.size / 1024).toFixed(2)} KB`;
    
    return `<tr>
      <td><a href="${file.name}">${file.name}</a></td>
      <td>${isDir ? 'Directory' : 'File'}</td>
      <td>${size}</td>
    </tr>`;
  }).join('');

  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <title>MicroApp Production Server</title>
    <style>
      body { font-family: Arial, sans-serif; margin: 40px; }
      h1 { color: #333; }
      table { border-collapse: collapse; width: 100%; margin-top: 20px; }
      th, td { text-align: left; padding: 8px; border-bottom: 1px solid #ddd; }
      th { background-color: #f2f2f2; }
      a { text-decoration: none; color: #0066cc; }
      a:hover { text-decoration: underline; }
      .info { background: #e7f3ff; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
      .success { background: #d4edda; color: #155724; padding: 10px; border-radius: 5px; margin-bottom: 15px; }
      .warning { background: #fff3cd; color: #856404; padding: 10px; border-radius: 5px; margin-bottom: 15px; }
    </style>
  </head>
  <body>
    <h1>🚀 MicroApp Module Federation Server</h1>
    <div class="success">
      <strong>✅ Server running!</strong> Serving Module Federation files on port ${PORT}
    </div>
    <div class="info">
      <strong>Directory served:</strong> ${BUILD_DIR}<br>
      <strong>Build command:</strong> <code>npm run bundle:android</code><br><br>
      <strong>Module Federation files expected:</strong>
      <ul>
        <li><strong>MicroApp.container.js.bundle</strong> - MF Container (main entry point)</li>
        <li><strong>__federation_expose_SimpleComponent.chunk.bundle</strong> - Exposed component</li>
        <li><strong>mf-manifest.json</strong> - MF Manifest with module info</li>
        <li><strong>mf-stats.json</strong> - MF Statistics and dependencies</li>
        <li><strong>Various chunks</strong> - React Native and dependency chunks</li>
      </ul>
      <strong>Key URLs for AppHost:</strong>
      <ul>
        <li><code>http://localhost:${PORT}/MicroApp.container.js.bundle</code></li>
        <li><code>http://localhost:${PORT}/mf-manifest.json</code></li>
      </ul>
    </div>
    ${allFiles.length === 0 ? `
    <div class="warning">
      <strong>⚠️ Directory empty!</strong> Run <code>npm run bundle:android</code> to generate Module Federation files.
    </div>
    ` : ''}
    <table>
      <thead>
        <tr>
          <th>File</th>
          <th>Type</th>
          <th>Size</th>
        </tr>
      </thead>
      <tbody>
        ${fileList || '<tr><td colspan="3" style="text-align: center; color: #999;">No files found</td></tr>'}
      </tbody>
    </table>
  </body>
  </html>
  `;

  res.writeHead(200, {
    'Content-Type': 'text/html',
    'Access-Control-Allow-Origin': '*'
  });
  res.end(html);
}

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  let pathname = parsedUrl.pathname;

  // Remove leading slash
  if (pathname.startsWith('/')) {
    pathname = pathname.slice(1);
  }

  // If no file specified, show file list
  if (pathname === '' || pathname === '/') {
    console.log(`📂 Listing available files`);
    listFiles(res);
    return;
  }

  // Special handling for Module Federation entry points
  // Map common MF entry names to actual Re.Pack generated files
  if (pathname === 'remoteEntry.js' || pathname === 'remote-entry.js') {
    // Re.Pack generates container files with specific naming
    pathname = 'MicroApp.container.js.bundle';
  }

  // Find the file
  const filePath = findFile(pathname);
  
  if (!filePath) {
    console.log(`❌ File not found: ${pathname}`);
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end(`File not found: ${pathname}`);
    return;
  }

  serveFile(res, filePath);
});

server.listen(PORT, '0.0.0.0', () => {
  console.log('🚀 ===============================================');
  console.log(`   MicroApp Module Federation Server STARTED!`);
  console.log('🚀 ===============================================');
  console.log(`📡 Server running at: http://localhost:${PORT}`);
  console.log(`📡 Accessible at: http://0.0.0.0:${PORT}`);
  console.log(`📂 Serving from: ${BUILD_DIR}`);
  console.log('');
  console.log('📋 Important URLs:');
  console.log(`   • File listing: http://localhost:${PORT}/`);
  console.log(`   • MF Container: http://localhost:${PORT}/MicroApp.container.js.bundle`);
  console.log(`   • MF Manifest: http://localhost:${PORT}/mf-manifest.json`);
  console.log(`   • Exposed Component: http://localhost:${PORT}/__federation_expose_SimpleComponent.chunk.bundle`);
  console.log('');
  console.log('⚠️  To stop server: Ctrl+C');
  console.log('===============================================');

  // Check if directory exists
  if (!fs.existsSync(BUILD_DIR)) {
    console.log('');
    console.log('⚠️  WARNING: Android build directory not found!');
    console.log(`   Run: npm run bundle:android`);
  } else {
    const files = fs.readdirSync(BUILD_DIR);
    console.log('');
    console.log(`Files in android directory (${files.length}):`);
    files.forEach(file => {
      const filePath = path.join(BUILD_DIR, file);
      const stats = fs.statSync(filePath);
      const size = `${(stats.size / 1024).toFixed(2)} KB`;
      console.log(`   - ${file} (${size})`);
    });
  }
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Error: Port ${PORT} is already in use!`);
    console.log('   Options:');
    console.log('   1. Stop the process using port 8090');
    console.log('   2. Change PORT in server.js');
    process.exit(1);
  } else {
    console.error('Server error:', err);
  }
});
