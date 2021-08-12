package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.Incident;
import com.mycompany.myapp.repository.IncidentRepository;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.mycompany.myapp.domain.Incident}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class IncidentResource {

    private final Logger log = LoggerFactory.getLogger(IncidentResource.class);

    private static final String ENTITY_NAME = "incident";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final IncidentRepository incidentRepository;

    public IncidentResource(IncidentRepository incidentRepository) {
        this.incidentRepository = incidentRepository;
    }

    /**
     * {@code POST  /incidents} : Create a new incident.
     *
     * @param incident the incident to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new incident, or with status {@code 400 (Bad Request)} if the incident has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/incidents")
    public ResponseEntity<Incident> createIncident(@Valid @RequestBody Incident incident) throws URISyntaxException {
        log.debug("REST request to save Incident : {}", incident);
        if (incident.getId() != null) {
            throw new BadRequestAlertException("A new incident cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Incident result = incidentRepository.save(incident);
        return ResponseEntity
            .created(new URI("/api/incidents/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /incidents/:id} : Updates an existing incident.
     *
     * @param id the id of the incident to save.
     * @param incident the incident to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated incident,
     * or with status {@code 400 (Bad Request)} if the incident is not valid,
     * or with status {@code 500 (Internal Server Error)} if the incident couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/incidents/{id}")
    public ResponseEntity<Incident> updateIncident(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Incident incident
    ) throws URISyntaxException {
        log.debug("REST request to update Incident : {}, {}", id, incident);
        if (incident.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, incident.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!incidentRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Incident result = incidentRepository.save(incident);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, incident.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /incidents/:id} : Partial updates given fields of an existing incident, field will ignore if it is null
     *
     * @param id the id of the incident to save.
     * @param incident the incident to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated incident,
     * or with status {@code 400 (Bad Request)} if the incident is not valid,
     * or with status {@code 404 (Not Found)} if the incident is not found,
     * or with status {@code 500 (Internal Server Error)} if the incident couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/incidents/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<Incident> partialUpdateIncident(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Incident incident
    ) throws URISyntaxException {
        log.debug("REST request to partial update Incident partially : {}, {}", id, incident);
        if (incident.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, incident.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!incidentRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Incident> result = incidentRepository
            .findById(incident.getId())
            .map(
                existingIncident -> {
                    if (incident.getGravite() != null) {
                        existingIncident.setGravite(incident.getGravite());
                    }
                    if (incident.getChauffeur() != null) {
                        existingIncident.setChauffeur(incident.getChauffeur());
                    }
                    if (incident.getResponsableincident() != null) {
                        existingIncident.setResponsableincident(incident.getResponsableincident());
                    }
                    if (incident.getReporteurincident() != null) {
                        existingIncident.setReporteurincident(incident.getReporteurincident());
                    }

                    return existingIncident;
                }
            )
            .map(incidentRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, incident.getId().toString())
        );
    }

    /**
     * {@code GET  /incidents} : get all the incidents.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of incidents in body.
     */
    @GetMapping("/incidents")
    public List<Incident> getAllIncidents() {
        log.debug("REST request to get all Incidents");
        return incidentRepository.findAll();
    }

    /**
     * {@code GET  /incidents/:id} : get the "id" incident.
     *
     * @param id the id of the incident to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the incident, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/incidents/{id}")
    public ResponseEntity<Incident> getIncident(@PathVariable Long id) {
        log.debug("REST request to get Incident : {}", id);
        Optional<Incident> incident = incidentRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(incident);
    }

    /**
     * {@code DELETE  /incidents/:id} : delete the "id" incident.
     *
     * @param id the id of the incident to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/incidents/{id}")
    public ResponseEntity<Void> deleteIncident(@PathVariable Long id) {
        log.debug("REST request to delete Incident : {}", id);
        incidentRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
