interface IProviderInfo {
    id: string;
    type: string;
    check: string;
    name: string;
    logo: string;
    description?: string;
    package?: {
        required?: string[];
    };
}

type ThemeColors = {
    background: string;
    main: string;
    secondary: string;
    border: string;
    hover: string;
};

type SimpleFunction = (input?: any) => void;
