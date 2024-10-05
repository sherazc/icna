package org.event.register.entity.event

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.JoinTable
import jakarta.persistence.ManyToMany
import jakarta.persistence.ManyToOne

/**
 * Person who is attending the event.
 * Person whose badge will be printed
 */
@Entity
data class Attendee(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long?,
    @ManyToOne
    @JoinColumn(name = "registration_id")
    var registration: Registration?,
    @Column(nullable = false)
    var firstName: String,
    @Column(nullable = false)
    var lastName: String,
) {
    /**
     * Creating @ManyToMany relation in primary constructor was causing a lot of issues.
     * e.g. https://stackoverflow.com/questions/54057136/stackoverflowerror-while-using-manytomany
     *
     * Creating Set also caused issues. Made it nullable? MutableSet. I guess this will also be issue
     * for @OneToMany relation.
     */
    @ManyToMany
    @JoinTable(
        name = "M2M_EVENT_PROGRAM_ATTENDEE",
        joinColumns = [JoinColumn(name = "ATTENDEE_ID")],
        inverseJoinColumns = [JoinColumn(name = "EVENT_PROGRAM_ID")])
    var eventPrograms: MutableSet<EventProgram>? = mutableSetOf()
}