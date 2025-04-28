declare module "next" {
    // Sobreescribir el tipo PageProps para que no espere que params sea una Promise
    interface PageProps {
      params?: { [key: string]: string };
      searchParams?: { [key: string]: string | string[] | undefined };
    }
  }
  
  export {}