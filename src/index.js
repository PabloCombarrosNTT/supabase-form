import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";

const SUPABASE_URL = "https://jsdpejwwbcdnjcxzvbxr.supabase.co/rest/v1/solicitudes";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpzZHBland3YmNkbmpjeHp2YnhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcwMTE5NzAsImV4cCI6MjA5MjU4Nzk3MH0.CjzRVJ3TvCUeH37Wcsgh8Aw7qm_eKuojaf0Z5M1Bq5E";

function App() {
    const [form, setForm] = useState({ titulo: "", descripcion: "", categoria: "", prioridad: "", email: "" });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [solicitudes, setSolicitudes] = useState([]);
    const [fetchError, setFetchError] = useState(null);
    const [exito, setExito] = useState(false);
    const [emailGuardado, setEmailGuardado] = useState("");

    const validate = (f) => {
        const e = {};
        if (!f.titulo || f.titulo.length < 5 || f.titulo.length > 60) e.titulo = "El título debe tener entre 5 y 60 caracteres";
        if (!f.descripcion || f.descripcion.length < 20 || f.descripcion.length > 500) e.descripcion = "La descripción debe tener entre 20 y 500 caracteres";
        if (!f.categoria) e.categoria = "La categoría es obligatoria";
        if (!f.prioridad || f.prioridad < 1 || f.prioridad > 5) e.prioridad = "Prioridad entre 1 y 5";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = "Email inválido";
        return e;
    };

    const handleChange = (e) => {
        const newForm = { ...form, [e.target.name]: e.target.value };
        setForm(newForm);
        setErrors(validate(newForm));
    };

    const isValid = Object.keys(errors).length === 0 && form.titulo && form.descripcion && form.categoria && form.prioridad && form.email;

    const fetchSolicitudes = async (email) => {
        try {
            setFetchError(null);
            const response = await fetch(`${SUPABASE_URL}?email=eq.${email}&order=created_at.desc`, {
                headers: { "apikey": SUPABASE_ANON_KEY, "Authorization": `Bearer ${SUPABASE_ANON_KEY}` }
            });
            if (!response.ok) throw new Error();
            setSolicitudes(await response.json());
        } catch {
            setFetchError("Error cargando solicitudes.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isValid) return;
        setLoading(true);
        setExito(false);
        try {
            const response = await fetch(SUPABASE_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "apikey": SUPABASE_ANON_KEY,
                    "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
                    "Prefer": "return=minimal"
                },
                body: JSON.stringify({ ...form, prioridad: Number(form.prioridad) })
            });
            if (!response.ok) throw new Error();
            const emailActual = form.email;
            setEmailGuardado(emailActual);
            setExito(true);
            setForm({ titulo: "", descripcion: "", categoria: "", prioridad: "", email: "" });
            setErrors({});
            await fetchSolicitudes(emailActual);
        } catch {
            alert("Error al guardar. Intente nuevamente.");
        } finally {
            setLoading(false);
        }
    };

    return (
<div style={{ maxWidth: "800px", margin: "40px auto", fontFamily: "Arial", padding: "0 1rem" }}>
<h2>Formulario de Solicitud</h2>

            {exito && <div style={{ background: "#d4edda", color: "#155724", padding: "10px", marginBottom: "10px", borderRadius: "4px" }}>Solicitud enviada correctamente.</div>}

            <form onSubmit={handleSubmit}>
<div style={{ marginBottom: "10px" }}>
<input name="titulo" type="text" placeholder="Título (5-60 caracteres)" value={form.titulo} onChange={handleChange} style={{ width: "100%", padding: "8px" }} />
                    {errors.titulo && <div style={{ color: "red", fontSize: "0.85rem" }}>{errors.titulo}</div>}
</div>
<div style={{ marginBottom: "10px" }}>
<textarea name="descripcion" placeholder="Descripción (20-500 caracteres)" value={form.descripcion} onChange={handleChange} style={{ width: "100%", padding: "8px", height: "80px" }} />
                    {errors.descripcion && <div style={{ color: "red", fontSize: "0.85rem" }}>{errors.descripcion}</div>}
</div>
<div style={{ marginBottom: "10px" }}>
<input name="categoria" type="text" placeholder="Categoría" value={form.categoria} onChange={handleChange} style={{ width: "100%", padding: "8px" }} />
                    {errors.categoria && <div style={{ color: "red", fontSize: "0.85rem" }}>{errors.categoria}</div>}
</div>
<div style={{ marginBottom: "10px" }}>
<select name="prioridad" value={form.prioridad} onChange={handleChange} style={{ width: "100%", padding: "8px" }}>
<option value="">Prioridad</option>
<option value="1">1</option>
<option value="2">2</option>
<option value="3">3</option>
<option value="4">4</option>
<option value="5">5</option>
</select>
                    {errors.prioridad && <div style={{ color: "red", fontSize: "0.85rem" }}>{errors.prioridad}</div>}
</div>
<div style={{ marginBottom: "10px" }}>
<input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} style={{ width: "100%", padding: "8px" }} />
                    {errors.email && <div style={{ color: "red", fontSize: "0.85rem" }}>{errors.email}</div>}
</div>
<button type="submit" disabled={!isValid || loading} style={{ padding: "8px 16px", cursor: (!isValid || loading) ? "not-allowed" : "pointer" }}>
                    {loading ? "Enviando..." : "Enviar"}
</button>
</form>

            <hr />

            <h3>Mis solicitudes</h3>
            {fetchError && (
<div style={{ color: "red" }}>
                    {fetchError}
<button onClick={() => fetchSolicitudes(emailGuardado || form.email)} style={{ marginLeft: "10px" }}>Reintentar</button>
</div>
            )}
            {solicitudes.length === 0 && !fetchError && <p>No hay solicitudes.</p>}
            {solicitudes.map((item) => (
<div key={item.id} style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px", borderRadius: "4px" }}>
<strong>{item.titulo}</strong>
<div>Categoría: {item.categoria} | Prioridad: {item.prioridad}</div>
<div>{item.descripcion}</div>
<small style={{ color: "#888" }}>{new Date(item.created_at).toLocaleString()}</small>
</div>
            ))}
</div>
    );
}

class WebComponent extends HTMLElement {
    connectedCallback() {
        ReactDOM.createRoot(this).render(<App />);
    }
}

customElements.define("supabase-form", WebComponent);