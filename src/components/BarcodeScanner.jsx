import React, { useEffect, useState } from 'react';
import { X, ScanLine } from 'lucide-react';
import { products } from '../data/products';

export function BarcodeScanner({ onClose, onScan }) {
    const [scanning, setScanning] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setScanning(false);
            // Simulate finding a random product
            const randomProduct = products[Math.floor(Math.random() * products.length)];
            onScan(randomProduct);
        }, 3000);

        return () => clearTimeout(timer);
    }, [onScan]);

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'black',
            zIndex: 2500,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            {/* Close Button */}
            <button
                onClick={onClose}
                style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: 'none',
                    cursor: 'pointer',
                    zIndex: 10
                }}
            >
                <X size={24} color="white" />
            </button>

            {/* Camera View Simulation */}
            <div style={{
                width: '100%',
                height: '100%',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Fake Camera Feed Background */}
                <div style={{
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(45deg, #1a1a1a, #2c3e50)',
                    opacity: 0.8
                }}></div>

                {/* Scanner Overlay */}
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '280px',
                    height: '280px',
                    border: '2px solid rgba(255,255,255,0.5)',
                    borderRadius: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    {/* Scanning Line Animation */}
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '2px',
                        backgroundColor: 'var(--color-accent)',
                        boxShadow: '0 0 10px var(--color-accent)',
                        animation: 'scan 2s infinite linear'
                    }}>
                        <style>
                            {`
                @keyframes scan {
                  0% { top: 0; opacity: 0; }
                  10% { opacity: 1; }
                  90% { opacity: 1; }
                  100% { top: 100%; opacity: 0; }
                }
              `}
                        </style>
                    </div>

                    <div style={{ textAlign: 'center', color: 'white' }}>
                        <ScanLine size={48} style={{ opacity: 0.5, marginBottom: '1rem' }} />
                        <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>Apunte al código de barras</p>
                    </div>
                </div>

                {/* Corner Markers */}
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '300px',
                    height: '300px',
                    pointerEvents: 'none'
                }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '40px', height: '40px', borderTop: '4px solid var(--color-secondary)', borderLeft: '4px solid var(--color-secondary)', borderTopLeftRadius: '12px' }}></div>
                    <div style={{ position: 'absolute', top: 0, right: 0, width: '40px', height: '40px', borderTop: '4px solid var(--color-secondary)', borderRight: '4px solid var(--color-secondary)', borderTopRightRadius: '12px' }}></div>
                    <div style={{ position: 'absolute', bottom: 0, left: 0, width: '40px', height: '40px', borderBottom: '4px solid var(--color-secondary)', borderLeft: '4px solid var(--color-secondary)', borderBottomLeftRadius: '12px' }}></div>
                    <div style={{ position: 'absolute', bottom: 0, right: 0, width: '40px', height: '40px', borderBottom: '4px solid var(--color-secondary)', borderRight: '4px solid var(--color-secondary)', borderBottomRightRadius: '12px' }}></div>
                </div>
            </div>
        </div>
    );
}
