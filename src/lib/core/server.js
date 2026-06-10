
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;


export const serverFetch = async (path) => {
  try {
    const res = await fetch(`${baseUrl}${path}`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      console.error(`API Error: ${res.status} ${res.statusText} for ${path}`);
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }

    const text = await res.text();
    if (!text || text.trim() === '') {
      return null;
    }

    try {
      return JSON.parse(text);
    } catch (jsonError) {
      console.error(`Invalid JSON from ${path}:`, text.substring(0, 200));
      return null;
    }
  } catch (error) {
    console.error(`Server fetch error for ${path}:`, error);
    throw error;
  }
};




export const serverMutation = async (path, data, method = 'POST') => {
  try {
    const fullUrl = `${baseUrl}${path}`;
    console.log('Sending data:', data); 
    
    const res = await fetch(fullUrl, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const text = await res.text();
    
  
    if (!res.ok) {
      console.error(`Mutation Error: ${res.status} for ${path}`);
      console.error('Response body:', text);
      
    
      let errorMessage = `HTTP ${res.status}`;
      try {
        const errorData = JSON.parse(text);
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch(e) {
        errorMessage = text.substring(0, 200);
      }
      
      throw new Error(errorMessage);
    }

  
    if (!text || text.trim() === '') {
      return { success: true, message: 'Operation completed' };
    }

    return JSON.parse(text);
  } catch (error) {
    console.error(`Server mutation error for ${path}:`, error);
    throw error;
  }
};