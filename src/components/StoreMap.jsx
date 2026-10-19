import React from 'react';
import { X, MapPin, Clock, Phone } from 'lucide-react';

export function StoreMap({ onClose }) {
    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 2000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
        }}>
            <div className="animate-slide-up" style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                width: '100%',
                maxWidth: '500px',
                maxHeight: '90vh',
                overflowY: 'auto',
                position: 'relative'
            }}>
                <div className="flex-between" style={{ padding: '1rem', borderBottom: '1px solid #eee' }}>
                    <h3 style={{ margin: 0 }}>Nuestras Sucursales</h3>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                        <X size={24} />
                    </button>
                </div>

                <div style={{ padding: '1rem' }}>
                    {/* Map Image Placeholder */}
                    <div style={{
                        width: '100%',
                        height: '250px',
                        backgroundColor: '#eee',
                        borderRadius: '12px',
                        marginBottom: '1.5rem',
                        overflow: 'hidden',
                        position: 'relative'
                    }}>
                        <img
                            src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=600&h=400"
                            alt="Mapa"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <div style={{
                            position: 'absolute',
                            bottom: '1rem',
                            left: '1rem',
                            backgroundColor: 'white',
                            padding: '0.5rem 1rem',
                            borderRadius: '20px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                            fontSize: '0.85rem',
                            fontWeight: 'bold',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}>
                            <MapPin size={16} color="var(--color-primary)" />
                            Sucursal Centro
                        </div>
                    </div>

                    {/* Details */}
                    <div style={{ marginBottom: '2rem' }}>
                        <h4 style={{ marginBottom: '1rem', color: 'var(--color-primary)' }}>Abarrotes Alex - Centro</h4>

                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                            <MapPin color="#666" />
                            <div>
                                <div style={{ fontWeight: '500' }}>Dirección</div>
                                <p style={{ color: '#666', margin: 0, fontSize: '0.9rem' }}>
                                    Av. Reforma #123, Col. Centro<br />
                                    Ciudad de México, CDMX
                                </p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                            <Clock color="#666" />
                            <div>
                                <div style={{ fontWeight: '500' }}>Horario</div>
                                <p style={{ color: '#666', margin: 0, fontSize: '0.9rem' }}>
                                    Lunes a Domingo<br />
                                    8:00 AM - 10:00 PM
                                </p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <Phone color="#666" />
                            <div>
                                <div style={{ fontWeight: '500' }}>Teléfono</div>
                                <p style={{ color: '#666', margin: 0, fontSize: '0.9rem' }}>
                                    55 1234 5678
                                </p>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => window.open('https://maps.google.com', '_blank')}
                        className="btn btn-primary"
                        style={{ width: '100%' }}
                    >
                        Cómo llegar
                    </button>
                </div>
            </div>
        </div>
    );
}
